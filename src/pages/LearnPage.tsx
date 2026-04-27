import { useNavigate, useParams } from "react-router-dom";
import { ALL_LEVELS } from "@/curriculum/data";
import { Challenge } from "@/components/Challenge";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

export default function LearnPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const idx = useMemo(() => ALL_LEVELS.findIndex(l => l.level.id === levelId), [levelId]);

  if (idx === -1) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Level not found</h2>
        <p className="text-muted-foreground">Pick one from the sidebar.</p>
      </div>
    );
  }

  const { level, section } = ALL_LEVELS[idx];
  const next = ALL_LEVELS[idx + 1];

  return (
    <>
      <Helmet>
        <title>{level.title} — {section.title} | Vanilla Ninja</title>
        <meta name="description" content={`${level.goal} — interactive HTML, CSS & JavaScript challenge.`} />
      </Helmet>
      <Challenge
        key={level.id}
        level={level}
        onAdvance={() => next && navigate(`/learn/${next.level.id}`)}
      />
    </>
  );
}
