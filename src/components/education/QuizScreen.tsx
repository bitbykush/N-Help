import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { useEmergency } from '../../context/EmergencyContext';

export const QuizScreen: React.FC = () => {
  const { setCurrentView } = useEmergency();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const percentScore = Math.round((score / totalQuestions) * 100);

  return (
    <div className="space-y-4 pb-20 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-disaster-card border border-disaster-border p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              RADIOLOGICAL PREPAREDNESS QUIZ
            </h1>
            <p className="text-xs text-zinc-400">
              15 Realistic Scenarios for Life-Safety Knowledge Verification
            </p>
          </div>
        </div>

        {!isFinished && (
          <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-bold">
            {currentIndex + 1} / {totalQuestions}
          </span>
        )}
      </div>

      {/* QUIZ IN PROGRESS */}
      {!isFinished && currentQ && (
        <div className="bg-disaster-card border border-disaster-border rounded-xl p-5 space-y-4 shadow-xl">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Topic Badge & Question */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 font-semibold uppercase">
              Scenario Topic: {currentQ.topic}
            </span>
            <h2 className="text-sm font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-semibold';
                } else {
                  btnStyle = 'bg-zinc-950/50 border-zinc-900 text-zinc-600 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="font-mono font-bold text-zinc-500 shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {hasAnswered && (
            <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2 animate-fade-in text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>SCIENTIFIC RATIONALE</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-xs">
                {currentQ.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <span>{currentIndex + 1 === totalQuestions ? 'View Results' : 'Next Scenario'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIZ FINISHED RESULTS */}
      {isFinished && (
        <div className="bg-disaster-card border border-disaster-border rounded-xl p-6 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              CIVIL DEFENSE KNOWLEDGE EVALUATION
            </h2>
            <p className="text-xs text-zinc-400">
              Evaluation Completed for 15 Life-Safety Scenarios
            </p>
          </div>

          {/* Score Box */}
          <div className="p-4 bg-black/60 rounded-xl border border-zinc-800 max-w-xs mx-auto">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              KNOWLEDGE SCORE
            </span>
            <div className="text-3xl font-black font-mono text-amber-400 my-1">
              {score} / {totalQuestions}
            </div>
            <span className="text-xs font-semibold text-zinc-300 font-mono">
              ({percentScore}% Accuracy)
            </span>
          </div>

          {/* Critical Disclaimer: Never say "You are safe" */}
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-left text-xs text-zinc-400 space-y-1 max-w-md mx-auto">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Academic Knowledge Verification</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              This score measures your theoretical understanding of IAEA and NDMA radiation protocols. In a real-world radiological event, always follow direct orders broadcast by local emergency authorities.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => setCurrentView('safety-guide')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Safety Guides</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
