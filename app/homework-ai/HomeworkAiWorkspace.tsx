"use client";

import { useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkGradingJobRecord,
  HomeworkSubmissionRecord,
} from "@/lib/homework-ai/types";

type ViewMode = "teacher" | "student";

function getAssignmentWindowLabel(assignment: HomeworkAssignmentRecord) {
  const now = Date.now();
  const startsAt = new Date(assignment.startsAt).getTime();
  const dueAt = new Date(assignment.dueAt).getTime();
  if (Number.isFinite(startsAt) && now < startsAt) return "Chưa mở nhận bài";
  if (Number.isFinite(dueAt) && now > dueAt) return "Quá hạn nhưng vẫn nhận bài";
  return "Đang nhận bài";
}

export function HomeworkAiWorkspace({
  assignments,
  submissions,
  complaints,
  gradingJobs,
  metrics,
  activeProvider,
}: {
  assignments: HomeworkAssignmentRecord[];
  submissions: HomeworkSubmissionRecord[];
  complaints: HomeworkComplaintRecord[];
  gradingJobs: HomeworkGradingJobRecord[];
  metrics: {
    assignments: number;
    submissions: number;
    queuedJobs: number;
    processingJobs: number;
    graded: number;
    review: number;
    failedJobs: number;
    openComplaints: number;
  };
  activeProvider: string;
}) {
  const [view, setView] = useState<ViewMode>("teacher");
  const [studentName, setStudentName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const filteredAssignments = useMemo(() => {
    if (!classCode.trim()) return assignments;
    return assignments.filter(
      (assignment) =>
        assignment.classCode.toLowerCase() === classCode.trim().toLowerCase(),
    );
  }, [assignments, classCode]);

  async function postForm(
    event: FormEvent<HTMLFormElement>,
    endpoint: string,
    successText: string,
    busyKey: string,
  ) {
    event.preventDefault();
    setBusy(busyKey);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Không thể xử lý yêu cầu.");
      setMessage(successText);
      window.location.reload();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Không thể xử lý yêu cầu.",
      );
    } finally {
      setBusy(null);
    }
  }

  function studentSubmissionsFor(assignmentId: string) {
    return submissions.filter(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentName.toLowerCase() === studentName.trim().toLowerCase(),
    );
  }

  function hasOpenComplaint(submissionId: string) {
    return complaints.some(
      (complaint) =>
        complaint.submissionId === submissionId && complaint.status !== "resolved",
    );
  }

  function findSubmissionById(submissionId: string) {
    return submissions.find((submission) => submission.id === submissionId);
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section style={heroStyle}>
        <div style={rowStyle}>
          <div style={{ maxWidth: 760 }}>
            <div style={pillStyle}>Homework AI Workspace</div>
            <h1 style={{ fontSize: 34, margin: "0 0 12px" }}>
              MIU giao bài theo lớp, học sinh chỉ nộp bài được giao
            </h1>
            <p style={{ margin: 0, lineHeight: 1.6, color: "#d7e4f2" }}>
              Giáo viên tạo bài, nhập rubric và đáp án mẫu. Học sinh chọn bài của lớp
              mình, nộp ảnh bài làm, xem kết quả AI nếu không bị gắn cờ rà soát và có
              quyền khiếu nại.
            </p>
          </div>
          <div style={providerBoxStyle}>
            <div style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.85 }}>
              Provider
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>
              {activeProvider}
            </div>
          </div>
        </div>
      </section>

      <section style={metricsStyle}>
        <Metric label="Bài đã giao" value={metrics.assignments} />
        <Metric label="Bài đã nộp" value={metrics.submissions} />
        <Metric label="Đã chấm" value={metrics.graded} />
        <Metric label="Cần rà soát" value={metrics.review} />
        <Metric label="Khiếu nại mở" value={metrics.openComplaints} />
      </section>

      <section style={panelStyle}>
        <h2 style={titleStyle}>Trạng thái xử lý AI</h2>
        <div style={metricsStyle}>
          <Metric label="Job đợi chấm" value={metrics.queuedJobs} />
          <Metric label="Job đang xử lý" value={metrics.processingJobs} />
          <Metric label="Job lỗi" value={metrics.failedJobs} />
        </div>
      </section>

      <section style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={() => setView("teacher")} style={tabStyle(view === "teacher")}>
          Khu giáo viên
        </button>
        <button type="button" onClick={() => setView("student")} style={tabStyle(view === "student")}>
          Khu học sinh
        </button>
      </section>

      {message ? <div style={{ color: "#166534", fontWeight: 700 }}>{message}</div> : null}
      {error ? <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div> : null}

      {view === "teacher" ? (
        <section style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(340px, 430px) minmax(0, 1fr)" }}>
          <form
            onSubmit={(event) =>
              postForm(event, "/api/homework-ai/assignments", "Đã giao bài cho lớp.", "teacher-create")
            }
            style={panelStyle}
          >
            <h2 style={titleStyle}>Giáo viên giao bài</h2>
            <Field label="Lớp"><input name="classCode" required style={inputStyle} /></Field>
            <Field label="Tiêu đề bài tập"><input name="title" required style={inputStyle} /></Field>
            <Field label="Đề bài"><textarea name="instructions" rows={4} required style={textareaStyle} /></Field>
            <Field label="Đáp án mẫu"><textarea name="answerKey" rows={4} required style={textareaStyle} /></Field>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <RubricInput name="analysis_and_strategy" label="Phân tích và hướng giải" defaultScore={4} />
              <RubricInput name="calculation_skill" label="Kỹ năng tính toán" defaultScore={4} />
              <RubricInput name="presentation" label="Trình bày" defaultScore={2} />
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <Field label="Bắt đầu nhận bài"><input name="startsAt" type="datetime-local" required style={inputStyle} /></Field>
              <Field label="Hạn nộp"><input name="dueAt" type="datetime-local" required style={inputStyle} /></Field>
            </div>
            <Field label="Tệp đề bài đính kèm (ảnh hoặc PDF)">
              <input name="attachments" type="file" accept="image/jpeg,image/png,application/pdf" multiple style={inputStyle} />
            </Field>
            <button type="submit" disabled={busy === "teacher-create"} style={primaryButtonStyle(busy === "teacher-create")}>
              {busy === "teacher-create" ? "Đang tạo..." : "Giao bài cho lớp"}
            </button>
          </form>

          <div style={{ display: "grid", gap: 24 }}>
            <div style={panelStyle}>
              <h2 style={titleStyle}>Bài đã giao</h2>
              {assignments.length === 0 ? <div style={emptyStyle}>Chưa có bài nào được giao.</div> : assignments.map((assignment) => (
                <article key={assignment.id} style={cardStyle}>
                  <div style={rowStyle}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{assignment.title}</div>
                      <div style={{ color: "#5b6470" }}>Lớp {assignment.classCode} | {getAssignmentWindowLabel(assignment)}</div>
                    </div>
                    <span>{assignment.maxScore} điểm</span>
                  </div>
                  <div>{assignment.instructions}</div>
                  <div>Nhận bài: {new Date(assignment.startsAt).toLocaleString("vi-VN")}</div>
                  <div>Hạn nộp: {new Date(assignment.dueAt).toLocaleString("vi-VN")}</div>
                </article>
              ))}
            </div>

            <div style={panelStyle}>
              <h2 style={titleStyle}>Tiến trình chấm AI</h2>
              {gradingJobs.length === 0 ? <div style={emptyStyle}>Chưa có job chấm AI nào.</div> : gradingJobs.map((job) => {
                const submission = findSubmissionById(job.submissionId);
                return (
                  <article key={job.id} style={cardStyle}>
                    <div style={rowStyle}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{submission?.assignmentTitle ?? "Bài nộp chưa xác định"}</div>
                        <div style={{ color: "#5b6470" }}>
                          {submission ? `${submission.studentName} | Lớp ${submission.classCode}` : `Submission ${job.submissionId}`}
                        </div>
                      </div>
                      {jobBadge(job.status)}
                    </div>
                    <div><strong>Provider:</strong> {job.provider}</div>
                    <div><strong>Lần xử lý:</strong> {job.attempts}</div>
                    <div><strong>Xếp hàng:</strong> {new Date(job.queuedAt).toLocaleString("vi-VN")}</div>
                    {job.startedAt ? <div><strong>Bắt đầu:</strong> {new Date(job.startedAt).toLocaleString("vi-VN")}</div> : null}
                    {job.completedAt ? <div><strong>Kết thúc:</strong> {new Date(job.completedAt).toLocaleString("vi-VN")}</div> : null}
                    {job.errorMessage ? <div style={{ color: "#991b1b" }}><strong>Lỗi:</strong> {job.errorMessage}</div> : null}
                  </article>
                );
              })}
            </div>

            <div style={panelStyle}>
              <h2 style={titleStyle}>Khiếu nại của học sinh</h2>
              {complaints.length === 0 ? <div style={emptyStyle}>Chưa có khiếu nại nào.</div> : complaints.map((complaint) => (
                <article key={complaint.id} style={cardStyle}>
                  <div style={rowStyle}>
                    <div>
                      <strong>{complaint.studentName}</strong>
                      <div style={{ color: "#5b6470" }}>
                        Lớp {complaint.classCode} | {complaint.category === "wrong_submission" ? "Nộp nhầm bài" : "Khiếu nại chấm điểm"}
                      </div>
                    </div>
                    <span>{complaint.status}</span>
                  </div>
                  <div>{complaint.message}</div>
                  {complaint.category === "wrong_submission" && complaint.status === "open" ? (
                    <form onSubmit={(event) => postForm(event, "/api/homework-ai/unlocks", "Đã mở khóa thêm 1 lần nộp lại.", complaint.id)}>
                      <input type="hidden" name="complaintId" value={complaint.id} />
                      <button type="submit" disabled={busy === complaint.id} style={secondaryButtonStyle(busy === complaint.id)}>
                        {busy === complaint.id ? "Đang mở khóa..." : "Mở khóa 1 lần nộp lại"}
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ display: "grid", gap: 24 }}>
          <div style={panelStyle}>
            <h2 style={titleStyle}>Học sinh nhận và nộp bài</h2>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <Field label="Tên học sinh"><input value={studentName} onChange={(event) => setStudentName(event.target.value)} style={inputStyle} /></Field>
              <Field label="Lớp"><input value={classCode} onChange={(event) => setClassCode(event.target.value)} style={inputStyle} /></Field>
            </div>
          </div>

          {filteredAssignments.length === 0 ? <div style={emptyStyle}>Chưa có bài nào cho lớp này.</div> : filteredAssignments.map((assignment) => {
            const latestSubmission = studentName ? studentSubmissionsFor(assignment.id)[0] : undefined;
            return (
              <article key={assignment.id} style={panelStyle}>
                <div style={rowStyle}>
                  <div>
                    <h3 style={{ margin: 0 }}>{assignment.title}</h3>
                    <div style={{ color: "#5b6470" }}>Lớp {assignment.classCode} | {getAssignmentWindowLabel(assignment)}</div>
                  </div>
                  <span>{assignment.maxScore} điểm</span>
                </div>
                <div>{assignment.instructions}</div>
                <div>Hạn nộp: {new Date(assignment.dueAt).toLocaleString("vi-VN")}</div>

                {assignment.attachments.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {assignment.attachments.map((attachment) => (
                      <a key={attachment.id} href={attachment.publicUrl} target="_blank" rel="noreferrer" style={linkStyle}>
                        {attachment.filename}
                      </a>
                    ))}
                  </div>
                ) : null}

                {!studentName || !classCode ? (
                  <div style={emptyStyle}>Nhập tên học sinh và lớp để nộp bài.</div>
                ) : latestSubmission ? (
                  <div style={{ display: "grid", gap: 14 }}>
                    <div style={cardStyle}>
                      <div style={rowStyle}>
                        <strong>Bài đã nộp</strong>
                        {submissionBadge(latestSubmission.status)}
                      </div>
                      <div>
                        Lần nộp {latestSubmission.attemptNumber} | {latestSubmission.isLate ? "Nộp muộn" : "Nộp đúng hạn"}
                      </div>

                      {latestSubmission.status === "graded" && latestSubmission.result ? (
                        <>
                          <div><strong>Điểm toàn bài:</strong> {latestSubmission.result.totalScore}/{latestSubmission.result.maxScore}</div>
                          <div><strong>Lời khen:</strong> {latestSubmission.result.praise}</div>
                          <div>
                            <strong>Lỗi sai cần lưu ý:</strong>
                            <ul style={listStyle}>
                              {latestSubmission.result.mistakesToNote.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <strong>Gợi ý cải thiện:</strong>
                            <ul style={listStyle}>
                              {latestSubmission.result.improvementSuggestions.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                          <details>
                            <summary style={{ cursor: "pointer", fontWeight: 700 }}>Đáp án mẫu để đối chiếu</summary>
                            <div style={answerStyle}>{assignment.answerKey}</div>
                          </details>
                        </>
                      ) : (
                        <div>MIU đã nhận bài. Nếu bài đang cần rà soát, kết quả chi tiết sẽ hiển thị sau khi giáo viên kiểm tra.</div>
                      )}
                    </div>

                    {hasOpenComplaint(latestSubmission.id) ? (
                      <div style={emptyStyle}>Bài này đang có khiếu nại mở.</div>
                    ) : (
                      <form
                        onSubmit={(event) => postForm(event, "/api/homework-ai/complaints", "MIU đã nhận khiếu nại của bạn.", latestSubmission.id)}
                        style={cardStyle}
                      >
                        <input type="hidden" name="assignmentId" value={assignment.id} />
                        <input type="hidden" name="submissionId" value={latestSubmission.id} />
                        <input type="hidden" name="studentName" value={latestSubmission.studentName} />
                        <input type="hidden" name="classCode" value={latestSubmission.classCode} />
                        <Field label="Loại khiếu nại">
                          <select name="category" style={inputStyle}>
                            <option value="grading_issue">MIU chấm chưa đúng</option>
                            <option value="wrong_submission">Bạn đã nộp nhầm bài</option>
                          </select>
                        </Field>
                        <Field label="Nội dung khiếu nại">
                          <textarea name="message" rows={3} required style={textareaStyle} />
                        </Field>
                        <button type="submit" disabled={busy === latestSubmission.id} style={secondaryButtonStyle(busy === latestSubmission.id)}>
                          {busy === latestSubmission.id ? "Đang gửi..." : "Gửi khiếu nại"}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(event) => postForm(event, "/api/homework-ai/submissions", "MIU đã nhận bài và bắt đầu xử lý.", assignment.id)}
                    style={cardStyle}
                  >
                    <input type="hidden" name="assignmentId" value={assignment.id} />
                    <input type="hidden" name="studentName" value={studentName} />
                    <input type="hidden" name="classCode" value={classCode} />
                    <Field label="Ảnh bài làm">
                      <input name="images" type="file" accept="image/jpeg,image/png" multiple required style={inputStyle} />
                    </Field>
                    <button type="submit" disabled={busy === assignment.id} style={primaryButtonStyle(busy === assignment.id)}>
                      {busy === assignment.id ? "Đang nộp..." : "Nộp bài cho MIU chấm"}
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={metricStyle}>
      <div style={{ fontSize: 13, color: "#5b6470", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function RubricInput({ name, label, defaultScore }: { name: string; label: string; defaultScore: number }) {
  return (
    <div style={{ display: "grid", gap: 8, background: "#f8fafc", padding: 14, borderRadius: 14 }}>
      <strong>{label}</strong>
      <input name={`${name}Score`} type="number" min="1" max="10" defaultValue={defaultScore} required style={inputStyle} />
      <textarea name={`${name}Notes`} rows={3} style={textareaStyle} placeholder="Ghi chú chấm" />
    </div>
  );
}

function submissionBadge(status: HomeworkSubmissionRecord["status"]) {
  const badgeMap: Record<HomeworkSubmissionRecord["status"], { label: string; background: string; color: string }> = {
    queued: { label: "Đã xếp hàng", background: "#e0f2fe", color: "#075985" },
    processing: { label: "Đang xử lý", background: "#ede9fe", color: "#5b21b6" },
    graded: { label: "Đã chấm", background: "#dcfce7", color: "#166534" },
    needs_review: { label: "Cần rà soát", background: "#fef3c7", color: "#92400e" },
    failed: { label: "Xử lý lỗi", background: "#fee2e2", color: "#991b1b" },
  };
  const badge = badgeMap[status];
  return <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700, background: badge.background, color: badge.color }}>{badge.label}</span>;
}

function jobBadge(status: HomeworkGradingJobRecord["status"]) {
  const badgeMap: Record<HomeworkGradingJobRecord["status"], { label: string; background: string; color: string }> = {
    queued: { label: "Đợi chấm", background: "#e0f2fe", color: "#075985" },
    processing: { label: "Đang xử lý", background: "#ede9fe", color: "#5b21b6" },
    completed: { label: "Hoàn tất", background: "#dcfce7", color: "#166534" },
    failed: { label: "Lỗi", background: "#fee2e2", color: "#991b1b" },
  };
  const badge = badgeMap[status];
  return <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700, background: badge.background, color: badge.color }}>{badge.label}</span>;
}

const heroStyle: CSSProperties = { background: "linear-gradient(135deg, #102542 0%, #1e3a5f 45%, #295f7a 100%)", color: "#f8fafc", borderRadius: 24, padding: 28 };
const providerBoxStyle: CSSProperties = { minWidth: 220, padding: 16, borderRadius: 18, background: "rgba(10, 19, 34, 0.32)", border: "1px solid rgba(255,255,255,0.14)" };
const pillStyle: CSSProperties = { display: "inline-flex", padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.14)", fontSize: 12, fontWeight: 700, marginBottom: 16 };
const metricsStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 };
const metricStyle: CSSProperties = { background: "#ffffff", borderRadius: 16, padding: 20, border: "1px solid #d7dee7" };
const panelStyle: CSSProperties = { display: "grid", gap: 16, background: "#ffffff", borderRadius: 24, padding: 24, border: "1px solid #d7dee7" };
const cardStyle: CSSProperties = { display: "grid", gap: 12, border: "1px solid #d7dee7", borderRadius: 18, padding: 18 };
const titleStyle: CSSProperties = { margin: 0, fontSize: 24 };
const rowStyle: CSSProperties = { display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" };
const inputStyle: CSSProperties = { borderRadius: 12, border: "1px solid #cbd5e1", padding: "12px 14px", font: "inherit", background: "#ffffff" };
const textareaStyle: CSSProperties = { ...inputStyle, resize: "vertical", minHeight: 96 };
const emptyStyle: CSSProperties = { borderRadius: 16, padding: 18, background: "#f8fafc", color: "#475569" };
const listStyle: CSSProperties = { margin: "8px 0 0 18px", lineHeight: 1.7 };
const linkStyle: CSSProperties = { display: "inline-flex", alignItems: "center", padding: "8px 12px", borderRadius: 999, background: "#eff6ff", color: "#1d4ed8", textDecoration: "none", fontWeight: 700 };
const answerStyle: CSSProperties = { marginTop: 10, padding: 14, borderRadius: 12, background: "#f8fafc", whiteSpace: "pre-wrap" };

function primaryButtonStyle(disabled: boolean): CSSProperties {
  return { border: 0, borderRadius: 14, padding: "14px 18px", background: disabled ? "#8aa4bd" : "#102542", color: "#ffffff", fontSize: 15, fontWeight: 700, cursor: disabled ? "progress" : "pointer" };
}

function secondaryButtonStyle(disabled: boolean): CSSProperties {
  return { borderRadius: 14, padding: "12px 16px", border: "1px solid #102542", background: disabled ? "#cbd5e1" : "#ffffff", color: "#102542", fontSize: 14, fontWeight: 700, cursor: disabled ? "progress" : "pointer" };
}

function tabStyle(active: boolean): CSSProperties {
  return { borderRadius: 999, padding: "10px 16px", border: active ? "1px solid #102542" : "1px solid #cbd5e1", background: active ? "#102542" : "#ffffff", color: active ? "#ffffff" : "#102542", fontWeight: 700, cursor: "pointer" };
}
