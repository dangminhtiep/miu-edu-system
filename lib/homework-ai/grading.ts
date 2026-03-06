import type {
  ConfidenceLevel,
  GradingCriterionScore,
  HomeworkAssignmentRecord,
  NormalizedGradingResult,
  RubricCriterion,
} from "@/lib/homework-ai/types";

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asConfidenceLevel(value: unknown, fallback: ConfidenceLevel): ConfidenceLevel {
  return value === "high" || value === "medium" || value === "low" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampScore(score: number, maxScore: number) {
  return Math.min(Math.max(score, 0), maxScore);
}

function normalizeCriteriaScores(
  value: unknown,
  rubric: RubricCriterion[],
): GradingCriterionScore[] {
  const rawItems = Array.isArray(value) ? value : [];
  const byKey = new Map(
    rawItems
      .map((item) => asObject(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map((item) => [asString(item.criterionKey), item]),
  );

  return rubric.map((criterion) => {
    const raw = byKey.get(criterion.key);
    const score = clampScore(asNumber(raw?.score), criterion.maxScore);

    return {
      criterionKey: criterion.key,
      label: asString(raw?.label, criterion.label),
      score,
      maxScore: criterion.maxScore,
      comment: asString(
        raw?.comment,
        score === criterion.maxScore
          ? "Dat yeu cau theo tieu chi nay."
          : "Can ra soat them theo tieu chi nay.",
      ),
    };
  });
}

function deriveReviewReason(
  requestedReason: string,
  confidence: ConfidenceLevel,
  recognizedText: string,
  needsHumanReview: boolean,
) {
  if (requestedReason) {
    return requestedReason;
  }

  if (!needsHumanReview) {
    return "";
  }

  if (!recognizedText) {
    return "Khong doc duoc noi dung bai lam mot cach du tin cay.";
  }

  if (confidence === "low") {
    return "Do tin cay cua ket qua dang thap, can giao vien ra soat them.";
  }

  return "Can ra soat them truoc khi xem day la ket qua cuoi cung.";
}

export function normalizeGradingResult(
  rawResult: unknown,
  assignment: HomeworkAssignmentRecord,
): NormalizedGradingResult {
  const raw = asObject(rawResult) ?? {};
  const criteriaScores = normalizeCriteriaScores(raw.criteriaScores, assignment.rubric);
  const criteriaTotal = criteriaScores.reduce((total, criterion) => total + criterion.score, 0);
  const maxScore = assignment.maxScore;
  const requestedTotal = clampScore(asNumber(raw.totalScore, criteriaTotal), maxScore);
  const confidence = asConfidenceLevel(raw.confidence, "low");
  const recognizedText = asString(raw.recognizedText);
  const needsHumanReview =
    Boolean(raw.needsHumanReview) || confidence === "low" || recognizedText.length === 0;

  return {
    totalScore: Math.min(requestedTotal, criteriaTotal),
    maxScore,
    confidence,
    needsHumanReview,
    reviewReason: deriveReviewReason(
      asString(raw.reviewReason),
      confidence,
      recognizedText,
      needsHumanReview,
    ),
    ocrQuality: asConfidenceLevel(raw.ocrQuality, confidence),
    recognizedText,
    praise:
      asString(raw.praise) ||
      "MIU ghi nhan ban da hoan thanh bai va he thong da luu ket qua de doi chieu.",
    mistakesToNote:
      asStringArray(raw.mistakesToNote).length > 0
        ? asStringArray(raw.mistakesToNote)
        : ["MIU chua nhan dien du ro tung loi cu the trong bai lam nay."],
    improvementSuggestions:
      asStringArray(raw.improvementSuggestions).length > 0
        ? asStringArray(raw.improvementSuggestions)
        : ["Ban nen doi chieu dap an mau va trao doi voi giao vien neu can ra soat them."],
    criteriaScores,
  };
}
