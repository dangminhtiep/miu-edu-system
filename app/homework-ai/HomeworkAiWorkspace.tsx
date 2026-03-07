"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import type {
  HomeworkAssignmentRecord,
  HomeworkComplaintRecord,
  HomeworkGradingJobRecord,
  HomeworkReviewRecord,
  HomeworkSubmissionRecord,
  NormalizedGradingResult,
} from "@/lib/homework-ai/types";

type ViewMode = "teacher" | "student";

const QUICK_TEACHER_NOTE_TAGS = [
  "AI trừ điểm quá tay",
  "AI đọc nhầm chữ học sinh",
  "Chấm vớt",
];

function getAssignmentWindowLabel(assignment: HomeworkAssignmentRecord) {
  const now = Date.now();
  const startsAt = new Date(assignment.startsAt).getTime();
  const dueAt = new Date(assignment.dueAt).getTime();

  if (Number.isFinite(startsAt) && now < startsAt) return "Chưa mở nhận bài";
  if (Number.isFinite(dueAt) && now > dueAt) return "Quá hạn nhưng vẫn nhận bài";
  return "Đang nhận bài";
}

function getReviewDecisionLabel(review: HomeworkReviewRecord) {
  return review.decision === "approved_ai" ? "Duyệt kết quả AI" : "Giáo viên chỉnh tay";
}

export function HomeworkAiWorkspace({
  assignments,
  submissions,
  complaints,
  gradingJobs,
  reviews,
  metrics,
  activeProvider,
}: {
  assignments: HomeworkAssignmentRecord[];
  submissions: HomeworkSubmissionRecord[];
  complaints: HomeworkComplaintRecord[];
  gradingJobs: HomeworkGradingJobRecord[];
  reviews: HomeworkReviewRecord[];
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
  const [reviewerName, setReviewerName] = useState("");
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

  const latestReviewBySubmission = useMemo(() => {
    const reviewMap = new Map<string, HomeworkReviewRecord>();
    for (const review of reviews) {
      if (!reviewMap.has(review.submissionId)) {
        reviewMap.set(review.submissionId, review);
      }
    }
    return reviewMap;
  }, [reviews]);

  const openGradingComplaintBySubmission = useMemo(() => {
    const complaintMap = new Map<string, HomeworkComplaintRecord>();
    for (const complaint of complaints) {
      if (complaint.category === "grading_issue" && complaint.status === "open") {
        complaintMap.set(complaint.submissionId, complaint);
      }
    }
    return complaintMap;
  }, [complaints]);

  const reviewCandidates = useMemo(
    () =>
      submissions.filter(
        (submission) =>
          submission.result &&
          (submission.status === "needs_review" ||
            openGradingComplaintBySubmission.has(submission.id)),
      ),
    [openGradingComplaintBySubmission, submissions],
  );

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
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể xử lý yêu cầu.");
      }
      setMessage(successText);
      window.location.reload();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể xử lý yêu cầu.",
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

  function getDisplayedResult(submission: HomeworkSubmissionRecord) {
    const review = latestReviewBySubmission.get(submission.id);
    return review?.finalResult ?? submission.result;
  }

  return (
    <div className="homework-workspace" style={{ display: "grid", gap: 24 }}>
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
              quyền khiếu nại. Khi giáo viên rà soát, hệ thống giữ nguyên kết quả AI
              gốc và lưu riêng bản chốt cuối cùng.
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
        <section style={{ display: "grid", gap: 24 }}>
          <section className="homework-shell-two-col" style={{ display: "grid", gap: 24 }}>
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
              <div style={rubricGridStyle}>
                <RubricInput name="analysis_and_strategy" label="Phân tích và hướng giải" defaultScore={4} />
                <RubricInput name="calculation_skill" label="Kỹ năng tính toán" defaultScore={4} />
                <RubricInput name="presentation" label="Trình bày" defaultScore={2} />
              </div>
              <div className="homework-two-col">
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

            <section style={panelStyle}>
              <h2 style={titleStyle}>Người rà soát</h2>
              <Field label="Tên giáo viên đang chốt bài">
                <input value={reviewerName} onChange={(event) => setReviewerName(event.target.value)} placeholder="Ví dụ: Cô Mai" style={inputStyle} />
              </Field>
              <form
                onSubmit={(event) =>
                  postForm(
                    event,
                    "/api/homework-ai/seed",
                    "Đã tạo dữ liệu test cho Teacher Review.",
                    "teacher-seed",
                  )
                }
                style={{ display: "grid", gap: 12 }}
              >
                <button
                  type="submit"
                  disabled={busy === "teacher-seed"}
                  style={secondaryButtonStyle(busy === "teacher-seed")}
                >
                  {busy === "teacher-seed"
                    ? "Đang tạo dữ liệu test..."
                    : "Tạo dữ liệu test"}
                </button>
              </form>
              <div style={hintStyle}>
                Tạm thời đang dùng tên nhập tay để lưu vết review. Khi có auth, phần này phải đổi sang định danh phiên người dùng từ hệ thống.
              </div>
            </section>
          </section>

          <section style={panelStyle}>
            <h2 style={titleStyle}>Bài cần giáo viên chốt</h2>
            {reviewCandidates.length === 0 ? (
              <div style={emptyStyle}>Hiện chưa có bài nào chờ giáo viên rà soát.</div>
            ) : (
              reviewCandidates.map((submission) => (
                <ReviewCandidateCard
                  key={submission.id}
                  submission={submission}
                  complaint={openGradingComplaintBySubmission.get(submission.id)}
                  reviewerName={reviewerName}
                  busy={busy}
                  onSubmit={postForm}
                />
              ))
            )}
          </section>

          <section className="homework-teacher-columns" style={{ display: "grid", gap: 24 }}>
            <section style={panelStyle}>
              <h2 style={titleStyle}>Bản giáo viên đã chốt gần đây</h2>
              {reviews.length === 0 ? (
                <div style={emptyStyle}>Chưa có bản rà soát nào được lưu.</div>
              ) : (
                reviews.map((review) => {
                  const submission = findSubmissionById(review.submissionId);
                  return (
                    <article key={review.id} style={cardStyle}>
                      <div style={rowStyle}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{submission?.assignmentTitle ?? "Bài nộp đã thay đổi"}</div>
                          <div style={{ color: "#5b6470" }}>
                            {submission ? `${submission.studentName} | Lớp ${submission.classCode}` : review.submissionId}
                          </div>
                        </div>
                        <span style={infoBadgeStyle}>{getReviewDecisionLabel(review)}</span>
                      </div>
                      <div><strong>Giáo viên:</strong> {review.teacherName}</div>
                      <div><strong>Nguồn review:</strong> {review.reviewSource}</div>
                      <div><strong>Version:</strong> {review.reviewVersion}</div>
                      <div><strong>Điểm lệch so với AI:</strong> {review.totalScoreDelta}</div>
                      <div><strong>SLA:</strong> {review.reviewLatencySeconds} giây</div>
                    </article>
                  );
                })
              )}
            </section>
            <section style={panelStyle}>
              <h2 style={titleStyle}>Tiến trình chấm AI</h2>
              {gradingJobs.length === 0 ? (
                <div style={emptyStyle}>Chưa có job chấm AI nào.</div>
              ) : (
                gradingJobs.map((job) => {
                  const submission = findSubmissionById(job.submissionId);
                  return (
                    <article key={job.id} style={cardStyle}>
                      <div style={rowStyle}>
                        <div>
                          <div style={{ fontWeight: 700 }}>
                            {submission?.assignmentTitle ?? "Bài nộp chưa xác định"}
                          </div>
                          <div style={{ color: "#5b6470" }}>
                            {submission
                              ? `${submission.studentName} | Lớp ${submission.classCode}`
                              : `Submission ${job.submissionId}`}
                          </div>
                        </div>
                        {jobBadge(job.status)}
                      </div>
                      <div><strong>Provider:</strong> {job.provider}</div>
                      <div><strong>Lần xử lý:</strong> {job.attempts}</div>
                      {job.errorMessage ? (
                        <div style={{ color: "#991b1b" }}>
                          <strong>Lỗi:</strong> {job.errorMessage}
                        </div>
                      ) : null}
                    </article>
                  );
                })
              )}
            </section>

            <section style={panelStyle}>
              <h2 style={titleStyle}>Khiếu nại của học sinh</h2>
              {complaints.length === 0 ? (
                <div style={emptyStyle}>Chưa có khiếu nại nào.</div>
              ) : (
                complaints.map((complaint) => (
                  <article key={complaint.id} style={cardStyle}>
                    <div style={rowStyle}>
                      <div>
                        <strong>{complaint.studentName}</strong>
                        <div style={{ color: "#5b6470" }}>
                          Lớp {complaint.classCode} |{" "}
                          {complaint.category === "wrong_submission"
                            ? "Nộp nhầm bài"
                            : "Khiếu nại chấm điểm"}
                        </div>
                      </div>
                      <span>{complaint.status}</span>
                    </div>
                    <div>{complaint.message}</div>
                    {complaint.category === "wrong_submission" &&
                    complaint.status === "open" ? (
                      <form
                        onSubmit={(event) =>
                          postForm(
                            event,
                            "/api/homework-ai/unlocks",
                            "Đã mở khóa thêm 1 lần nộp lại.",
                            complaint.id,
                          )
                        }
                      >
                        <input type="hidden" name="complaintId" value={complaint.id} />
                        <button
                          type="submit"
                          disabled={busy === complaint.id}
                          style={secondaryButtonStyle(busy === complaint.id)}
                        >
                          {busy === complaint.id
                            ? "Đang mở khóa..."
                            : "Mở khóa 1 lần nộp lại"}
                        </button>
                      </form>
                    ) : null}
                  </article>
                ))
              )}
            </section>
          </section>
        </section>
      ) : (
        <section style={{ display: "grid", gap: 24 }}>
          <div style={panelStyle}>
            <h2 style={titleStyle}>Học sinh nhận và nộp bài</h2>
            <div className="homework-two-col">
              <Field label="Tên học sinh">
                <input
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="Lớp">
                <input
                  value={classCode}
                  onChange={(event) => setClassCode(event.target.value)}
                  style={inputStyle}
                />
              </Field>
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <div style={emptyStyle}>Chưa có bài nào cho lớp này.</div>
          ) : (
            filteredAssignments.map((assignment) => {
              const latestSubmission = studentName
                ? studentSubmissionsFor(assignment.id)[0]
                : undefined;
              const latestReview = latestSubmission
                ? latestReviewBySubmission.get(latestSubmission.id)
                : undefined;
              const displayedResult = latestSubmission
                ? getDisplayedResult(latestSubmission)
                : undefined;

              return (
                <article key={assignment.id} style={panelStyle}>
                  <div style={rowStyle}>
                    <div>
                      <h3 style={{ margin: 0 }}>{assignment.title}</h3>
                      <div style={{ color: "#5b6470" }}>
                        Lớp {assignment.classCode} | {getAssignmentWindowLabel(assignment)}
                      </div>
                    </div>
                    <span>{assignment.maxScore} điểm</span>
                  </div>
                  <div>{assignment.instructions}</div>
                  <div>Hạn nộp: {new Date(assignment.dueAt).toLocaleString("vi-VN")}</div>

                  {assignment.attachments.length > 0 ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {assignment.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={linkStyle}
                        >
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
                          Lần nộp {latestSubmission.attemptNumber} |{" "}
                          {latestSubmission.isLate ? "Nộp muộn" : "Nộp đúng hạn"}
                        </div>

                        {latestSubmission.status === "graded" && displayedResult ? (
                          <>
                            <div style={resultPanelStyle}>
                              <div style={rowStyle}>
                                <strong>
                                  {latestReview
                                    ? "Kết quả cuối do giáo viên chốt"
                                    : "Kết quả AI"}
                                </strong>
                                {latestReview ? (
                                  <span style={infoBadgeStyle}>{latestReview.teacherName}</span>
                                ) : null}
                              </div>
                              {latestReview?.teacherNote ? (
                                <div>
                                  <strong>Ghi chú của giáo viên:</strong>{" "}
                                  {latestReview.teacherNote}
                                </div>
                              ) : null}
                              <ResultSummary result={displayedResult} />
                            </div>
                            <details>
                              <summary style={{ cursor: "pointer", fontWeight: 700 }}>
                                Đáp án mẫu để đối chiếu
                              </summary>
                              <div style={answerStyle}>{assignment.answerKey}</div>
                            </details>
                          </>
                        ) : (
                          <div>
                            MIU đã nhận bài. Nếu bài đang cần rà soát, kết quả chi tiết sẽ
                            hiển thị sau khi giáo viên kiểm tra.
                          </div>
                        )}
                      </div>

                      {hasOpenComplaint(latestSubmission.id) ? (
                        <div style={emptyStyle}>Bài này đang có khiếu nại mở.</div>
                      ) : (
                        <form
                          onSubmit={(event) =>
                            postForm(
                              event,
                              "/api/homework-ai/complaints",
                              "MIU đã nhận khiếu nại của bạn.",
                              latestSubmission.id,
                            )
                          }
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
                          <button
                            type="submit"
                            disabled={busy === latestSubmission.id}
                            style={secondaryButtonStyle(busy === latestSubmission.id)}
                          >
                            {busy === latestSubmission.id ? "Đang gửi..." : "Gửi khiếu nại"}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <form
                      onSubmit={(event) =>
                        postForm(
                          event,
                          "/api/homework-ai/submissions",
                          "MIU đã nhận bài và bắt đầu xử lý.",
                          assignment.id,
                        )
                      }
                      style={cardStyle}
                    >
                      <input type="hidden" name="assignmentId" value={assignment.id} />
                      <input type="hidden" name="studentName" value={studentName} />
                      <input type="hidden" name="classCode" value={classCode} />
                      <Field label="Ảnh bài làm">
                        <input
                          name="images"
                          type="file"
                          accept="image/jpeg,image/png"
                          multiple
                          required
                          style={inputStyle}
                        />
                      </Field>
                      <button
                        type="submit"
                        disabled={busy === assignment.id}
                        style={primaryButtonStyle(busy === assignment.id)}
                      >
                        {busy === assignment.id ? "Đang nộp..." : "Nộp bài cho MIU chấm"}
                      </button>
                    </form>
                  )}
                </article>
              );
            })
          )}
        </section>
      )}
    </div>
  );
}

function ReviewCandidateCard({
  submission,
  complaint,
  reviewerName,
  busy,
  onSubmit,
}: {
  submission: HomeworkSubmissionRecord;
  complaint?: HomeworkComplaintRecord;
  reviewerName: string;
  busy: string | null;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    endpoint: string,
    successText: string,
    busyKey: string,
  ) => Promise<void>;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [teacherNote, setTeacherNote] = useState("");
  const aiResult = submission.result;

  if (!aiResult) {
    return null;
  }

  const selectedImageUrl = submission.imageUrls[selectedImageIndex] ?? submission.imageUrls[0];
  const canSubmitReview = reviewerName.trim().length > 0;

  function applyQuickTag(tag: string) {
    setTeacherNote((currentValue) => {
      if (!currentValue.trim()) return tag;
      if (currentValue.includes(tag)) return currentValue;
      return `${currentValue}\n${tag}`;
    });
  }

  return (
    <article className="homework-review-card" style={reviewCardStyle}>
      <div className="homework-review-image-panel-wrap" style={reviewImageColumnStyle}>
        <div className="homework-review-image-sticky" style={stickyImagePanelStyle}>
          <div style={rowStyle}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{submission.assignmentTitle}</div>
              <div style={{ color: "#5b6470" }}>
                {submission.studentName} | Lớp {submission.classCode}
              </div>
            </div>
            {submissionBadge(submission.status)}
          </div>

          {complaint ? (
            <div style={warningStyle}>Khiếu nại chấm điểm đang mở: {complaint.message}</div>
          ) : null}

          <div className="homework-review-image-panel" style={imageViewerStyle}>
            {selectedImageUrl ? (
              <Image
                src={selectedImageUrl}
                alt={`Bài làm của ${submission.studentName}`}
                width={720}
                height={980}
                unoptimized
                style={{
                  width: "100%",
                  height: "auto",
                  transform: `scale(${zoomPercent / 100})`,
                  transformOrigin: "top center",
                }}
              />
            ) : (
              <div style={emptyStyle}>Chưa có ảnh bài làm để rà soát.</div>
            )}
          </div>

          <Field label={`Zoom ảnh: ${zoomPercent}%`}>
            <input
              type="range"
              min="80"
              max="220"
              value={zoomPercent}
              onChange={(event) => setZoomPercent(Number(event.target.value))}
            />
          </Field>

          {submission.imageUrls.length > 1 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {submission.imageUrls.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  style={thumbnailButtonStyle(index === selectedImageIndex)}
                >
                  Trang {index + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="homework-review-form-panel" style={reviewFormColumnStyle}>
        <div style={panelStyle}>
          <h3 style={{ margin: 0 }}>Kết quả AI gốc</h3>
          <ResultSummary result={aiResult} />
        </div>

        <form
          onSubmit={(event) =>
            onSubmit(
              event,
              "/api/homework-ai/reviews",
              "Đã duyệt kết quả AI và chốt cho học sinh.",
              `approve-${submission.id}`,
            )
          }
          style={panelStyle}
        >
          <h3 style={{ margin: 0 }}>Duyệt nhanh</h3>
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="teacherName" value={reviewerName} />
          <input type="hidden" name="decision" value="approved_ai" />
          <input type="hidden" name="complaintId" value={complaint?.id ?? ""} />
          <input
            type="hidden"
            name="teacherNote"
            value="Giáo viên đã duyệt nguyên kết quả AI."
          />
          <button
            type="submit"
            disabled={!canSubmitReview || busy === `approve-${submission.id}`}
            style={secondaryButtonStyle(!canSubmitReview || busy === `approve-${submission.id}`)}
          >
            {!canSubmitReview
              ? "Nhập tên giáo viên để chốt"
              : busy === `approve-${submission.id}`
                ? "Đang chốt..."
                : "Duyệt kết quả AI"}
          </button>
        </form>

        <form
          onSubmit={(event) =>
            onSubmit(
              event,
              "/api/homework-ai/reviews",
              "Đã lưu bản giáo viên chỉnh tay và chốt cho học sinh.",
              `edit-${submission.id}`,
            )
          }
          style={panelStyle}
        >
          <h3 style={{ margin: 0 }}>Chỉnh sửa tay</h3>
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="teacherName" value={reviewerName} />
          <input type="hidden" name="decision" value="edited_result" />
          <input type="hidden" name="complaintId" value={complaint?.id ?? ""} />

          <Field label="Ghi chú của giáo viên">
            <textarea
              name="teacherNote"
              rows={3}
              required
              value={teacherNote}
              onChange={(event) => setTeacherNote(event.target.value)}
              placeholder="Ví dụ: MIU đã kiểm tra lại và điều chỉnh theo bài làm gốc."
              style={textareaStyle}
            />
          </Field>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {QUICK_TEACHER_NOTE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => applyQuickTag(tag)}
                style={quickTagStyle}
              >
                {tag}
              </button>
            ))}
          </div>

          <Field label="Lời khen hiển thị cho học sinh">
            <textarea
              name="praise"
              rows={2}
              defaultValue={aiResult.praise}
              style={textareaStyle}
            />
          </Field>
          <Field label="Lỗi sai cần lưu ý (mỗi dòng một ý)">
            <textarea
              name="mistakesToNote"
              rows={4}
              defaultValue={aiResult.mistakesToNote.join("\n")}
              style={textareaStyle}
            />
          </Field>
          <Field label="Gợi ý cải thiện (mỗi dòng một ý)">
            <textarea
              name="improvementSuggestions"
              rows={4}
              defaultValue={aiResult.improvementSuggestions.join("\n")}
              style={textareaStyle}
            />
          </Field>

          <div style={{ display: "grid", gap: 12 }}>
            {aiResult.criteriaScores.map((criterion) => (
              <div key={criterion.criterionKey} style={resultPanelStyle}>
                <strong>{criterion.label}</strong>
                <div className="homework-criteria-edit-grid">
                  <Field label={`Điểm / ${criterion.maxScore}`}>
                    <input
                      name={`criterionScore:${criterion.criterionKey}`}
                      type="number"
                      min="0"
                      max={criterion.maxScore}
                      step="0.1"
                      defaultValue={criterion.score}
                      required
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Nhận xét theo tiêu chí">
                    <textarea
                      name={`criterionComment:${criterion.criterionKey}`}
                      rows={2}
                      defaultValue={criterion.comment}
                      style={textareaStyle}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={!canSubmitReview || busy === `edit-${submission.id}`}
            style={primaryButtonStyle(!canSubmitReview || busy === `edit-${submission.id}`)}
          >
            {!canSubmitReview
              ? "Nhập tên giáo viên để chốt"
              : busy === `edit-${submission.id}`
                ? "Đang lưu..."
                : "Lưu bản giáo viên chỉnh tay"}
          </button>
        </form>
      </div>
    </article>
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

function ResultSummary({ result }: { result: NormalizedGradingResult }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <strong>Điểm toàn bài:</strong> {result.totalScore}/{result.maxScore}
      </div>
      <div>
        <strong>Lời khen:</strong> {result.praise}
      </div>
      <div>
        <strong>Lỗi sai cần lưu ý:</strong>
        <ul style={listStyle}>
          {result.mistakesToNote.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Gợi ý cải thiện:</strong>
        <ul style={listStyle}>
          {result.improvementSuggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {result.criteriaScores.map((criterion) => (
          <div key={criterion.criterionKey} style={criteriaRowStyle}>
            <div>
              <strong>{criterion.label}</strong>
            </div>
            <div>
              {criterion.score}/{criterion.maxScore}
            </div>
            <div style={{ gridColumn: "1 / -1", color: "#475569" }}>{criterion.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RubricInput({
  name,
  label,
  defaultScore,
}: {
  name: string;
  label: string;
  defaultScore: number;
}) {
  return (
    <div style={rubricCardStyle}>
      <strong>{label}</strong>
      <input
        name={`${name}Score`}
        type="number"
        min="1"
        max="10"
        defaultValue={defaultScore}
        required
        style={inputStyle}
      />
      <textarea
        name={`${name}Notes`}
        rows={3}
        style={textareaStyle}
        placeholder="Ghi chú chấm"
      />
    </div>
  );
}

function submissionBadge(status: HomeworkSubmissionRecord["status"]) {
  const badgeMap: Record<
    HomeworkSubmissionRecord["status"],
    { label: string; background: string; color: string }
  > = {
    queued: { label: "Đã xếp hàng", background: "#e0f2fe", color: "#075985" },
    processing: { label: "Đang xử lý", background: "#ede9fe", color: "#5b21b6" },
    graded: { label: "Đã chấm", background: "#dcfce7", color: "#166534" },
    needs_review: { label: "Cần rà soát", background: "#fef3c7", color: "#92400e" },
    failed: { label: "Xử lý lỗi", background: "#fee2e2", color: "#991b1b" },
  };
  const badge = badgeMap[status];
  return <span style={badgeStyle(badge.background, badge.color)}>{badge.label}</span>;
}

function jobBadge(status: HomeworkGradingJobRecord["status"]) {
  const badgeMap: Record<
    HomeworkGradingJobRecord["status"],
    { label: string; background: string; color: string }
  > = {
    queued: { label: "Đợi chấm", background: "#e0f2fe", color: "#075985" },
    processing: { label: "Đang xử lý", background: "#ede9fe", color: "#5b21b6" },
    completed: { label: "Hoàn tất", background: "#dcfce7", color: "#166534" },
    failed: { label: "Lỗi", background: "#fee2e2", color: "#991b1b" },
  };
  const badge = badgeMap[status];
  return <span style={badgeStyle(badge.background, badge.color)}>{badge.label}</span>;
}

function badgeStyle(background: string, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    background,
    color,
  };
}

function thumbnailButtonStyle(active: boolean): CSSProperties {
  return {
    borderRadius: 999,
    border: active ? "1px solid #102542" : "1px solid #cbd5e1",
    background: active ? "#102542" : "#ffffff",
    color: active ? "#ffffff" : "#102542",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  };
}

const heroStyle: CSSProperties = {
  background: "linear-gradient(135deg, #102542 0%, #1e3a5f 45%, #295f7a 100%)",
  color: "#f8fafc",
  borderRadius: 24,
  padding: 28,
};
const providerBoxStyle: CSSProperties = {
  minWidth: 220,
  padding: 16,
  borderRadius: 18,
  background: "rgba(10, 19, 34, 0.32)",
  border: "1px solid rgba(255,255,255,0.14)",
};
const pillStyle: CSSProperties = {
  display: "inline-flex",
  padding: "6px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 16,
};
const metricsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};
const metricStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 20,
  border: "1px solid #d7dee7",
};
const panelStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  background: "#ffffff",
  borderRadius: 24,
  padding: 24,
  border: "1px solid #d7dee7",
};
const cardStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  border: "1px solid #d7dee7",
  borderRadius: 18,
  padding: 18,
};
const reviewCardStyle: CSSProperties = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)",
  border: "1px solid #d7dee7",
  borderRadius: 22,
  padding: 18,
  background: "#fdfefe",
};
const reviewImageColumnStyle: CSSProperties = { minWidth: 0 };
const reviewFormColumnStyle: CSSProperties = { display: "grid", gap: 16, minWidth: 0 };
const stickyImagePanelStyle: CSSProperties = {
  position: "sticky",
  top: 24,
  display: "grid",
  gap: 14,
};
const imageViewerStyle: CSSProperties = {
  minHeight: 420,
  maxHeight: 680,
  overflow: "auto",
  background: "#f8fafc",
  borderRadius: 16,
  border: "1px solid #d7dee7",
  padding: 16,
  display: "grid",
  placeItems: "start center",
};
const rubricGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
};
const rubricCardStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  background: "#f8fafc",
  padding: 14,
  borderRadius: 14,
};
const titleStyle: CSSProperties = { margin: 0, fontSize: 24 };
const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
};
const inputStyle: CSSProperties = {
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  font: "inherit",
  background: "#ffffff",
};
const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 96,
};
const emptyStyle: CSSProperties = {
  borderRadius: 16,
  padding: 18,
  background: "#f8fafc",
  color: "#475569",
};
const listStyle: CSSProperties = { margin: "8px 0 0 18px", lineHeight: 1.7 };
const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#1d4ed8",
  textDecoration: "none",
  fontWeight: 700,
};
const answerStyle: CSSProperties = {
  marginTop: 10,
  padding: 14,
  borderRadius: 12,
  background: "#f8fafc",
  whiteSpace: "pre-wrap",
};
const resultPanelStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 14,
  borderRadius: 14,
  background: "#f8fafc",
};
const warningStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: "#fff7ed",
  color: "#9a3412",
};
const hintStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
  color: "#475569",
};
const infoBadgeStyle: CSSProperties = {
  ...badgeStyle("#eff6ff", "#1d4ed8"),
};
const criteriaRowStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  gridTemplateColumns: "minmax(0, 1fr) auto",
  padding: 12,
  borderRadius: 12,
  background: "#ffffff",
  border: "1px solid #d7dee7",
};
const quickTagStyle: CSSProperties = {
  borderRadius: 999,
  padding: "8px 12px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#102542",
  cursor: "pointer",
  fontWeight: 700,
};

function primaryButtonStyle(disabled: boolean): CSSProperties {
  return {
    border: 0,
    borderRadius: 14,
    padding: "14px 18px",
    background: disabled ? "#8aa4bd" : "#102542",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function secondaryButtonStyle(disabled: boolean): CSSProperties {
  return {
    borderRadius: 14,
    padding: "12px 16px",
    border: "1px solid #102542",
    background: disabled ? "#cbd5e1" : "#ffffff",
    color: "#102542",
    fontSize: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function tabStyle(active: boolean): CSSProperties {
  return {
    borderRadius: 999,
    padding: "10px 16px",
    border: active ? "1px solid #102542" : "1px solid #cbd5e1",
    background: active ? "#102542" : "#ffffff",
    color: active ? "#ffffff" : "#102542",
    fontWeight: 700,
    cursor: "pointer",
  };
}
