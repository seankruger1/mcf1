import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  StopCircle,
  Play,
  Pause,
  Trash2,
  Download,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Globe,
  User,
  FileText,
  AudioLines,
  Save,
  Shield,
} from "lucide-react";

type AudioAnswer = {
  name: string;
  url: string;
  mimeType: string;
  createdAt: string;
};

type TextAudioAnswer = {
  text: string;
  audio?: AudioAnswer;
};

const sectionMeta = [
  { id: "consent", title: "Consent & language", icon: Shield },
  { id: "demographics", title: "Demographics", icon: User },
  { id: "explore", title: "Explore", icon: Globe },
  { id: "engage", title: "Engage", icon: FileText },
  { id: "accelerate", title: "Accelerate", icon: AudioLines },
  { id: "review", title: "Review & export", icon: CheckCircle2 },
];

const exploreQuestions = [
  {
    id: "C1",
    prompt: "What types of work do you think would be meaningful for you, and why?",
    help: "You can reflect on gig work, remote work, office work, hands on work, research, self employment, or the type of setting that feels right for you.",
  },
  { id: "C2", prompt: "What kind of information or data would help you make a more informed choice about meaningful work?" },
  {
    id: "C3",
    prompt: "What subjects or topics do you enjoy learning about?",
    help: "You may also explain what skills you currently have and how you learned them.",
  },
  { id: "C4", prompt: "What types of careers or skills are needed in the region where you live?" },
  { id: "C5", prompt: "What expectations do your family or community have about your work or career choices?" },
  { id: "C6", prompt: "I would like to hear more about the role of technology in your career or work considerations." },
  { id: "C7", prompt: "Where are you getting your information from about possible jobs or study opportunities?" },
];

const engageQuestions = [
  { id: "D1", prompt: "I am interested to hear about how you get support and guidance regarding your career or work opportunities." },
  { id: "D2", prompt: "What kind of job or opportunity are you actively preparing yourself for at the moment?" },
  { id: "D3", prompt: "I would like to talk about the practicalities of searching for a job. Please tell me about any experiences you have had." },
  { id: "D4", prompt: "How would you go about looking for new work or income opportunities if you had to start today?" },
  { id: "D5", prompt: "Would you consider relocating for a better job or opportunity? Why or why not?" },
  { id: "D6", prompt: "How confident do you feel about your chances of finding meaningful work or income?" },
];

const accelerateQuestions = [
  { id: "E1", prompt: "I would like to hear about any work experience you may have had, either as an employee or as an entrepreneur." },
  { id: "E2", prompt: "In what ways have your expectations changed around getting work or generating an income? What do you wish someone told you earlier?" },
  { id: "E3", prompt: "Have you ever accessed counselling, mentoring, or career support? If so, what was useful and what was not?" },
  { id: "E4", prompt: "Tell me about opportunities to grow in your current job, field, or business." },
  { id: "E5", prompt: "How are you building your professional profile or network?" },
  { id: "E6", prompt: "How are online platforms or online communities shaping how you build or find work?" },
  { id: "E7", prompt: "In what ways does your current field, job, or role allow you to be entrepreneurial?" },
  { id: "E8", prompt: "If you had access to a tool or platform to help you choose a job or career, what would this look like to you?" },
];

const qualitativeQuestions = [
  ...exploreQuestions.map((q) => ({ ...q, group: "Explore" })),
  ...engageQuestions.map((q) => ({ ...q, group: "Engage" })),
  ...accelerateQuestions.map((q) => ({ ...q, group: "Accelerate" })),
];

const demographicConfig = [
  { id: "ageBand", label: "Age band", type: "select", options: ["Under 18", "18 to 24", "25 to 34", "35 to 44", "45 to 54", "55+", "Prefer not to say"] },
  { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Non binary", "Prefer not to say", "Other"] },
  { id: "nationality", label: "Nationality or citizenship", type: "text" },
  { id: "locationType", label: "Where do you live?", type: "select", options: ["City", "Suburb", "Township", "Village", "Farm", "Other"] },
  { id: "livingWith", label: "Who do you live with?", type: "select", options: ["Alone", "One parent", "Both parents", "Caregiver", "Partner", "Friends or roommates", "Other"] },
  { id: "currentSituation", label: "Current situation", type: "select", options: ["In school", "In tertiary", "Unemployed", "Informally employed", "Employed", "Self employed"] },
  { id: "education", label: "Highest level of education completed", type: "select", options: ["None", "Primary", "Secondary", "Matric", "Diploma", "Degree", "Honours", "Masters", "PhD"] },
  { id: "grantSupport", label: "Do you receive social grants or financial support?", type: "select", options: ["Yes", "No", "Prefer not to say"] },
  { id: "incomeStatus", label: "Do you currently earn any income?", type: "select", options: ["Yes", "No", "Prefer not to say"] },
  { id: "incomeBand", label: "Monthly income band", type: "select", options: ["No income", "Under R1,000", "R1,000 to R4,999", "R5,000 to R9,999", "R10,000 to R19,999", "R20,000+", "Prefer not to say"] },
  { id: "incomeSource", label: "Main source of income or work", type: "select", options: ["Formal employment", "Informal work", "Self employment", "Gig work", "Mixed income", "Family support", "Other"] },
];

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      //
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function IconButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  asLink,
  href,
  download,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  asLink?: boolean;
  href?: string;
  download?: string;
}) {
  const className = `btn ${variant} ${disabled ? "disabled" : ""}`;
  if (asLink && href) {
    return (
      <a className={className} href={href} download={download}>
        {children}
      </a>
    );
  }
  return (
    <button className={className} type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function SectionBadge({ label, count }: { label: string; count: number }) {
  return (
    <div className="section-badge">
      <span>{label}</span>
      <span className="pill">{count}</span>
    </div>
  );
}

function AudioRecorder({
  value,
  onChange,
}: {
  value?: AudioAnswer;
  onChange: (next?: AudioAnswer) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        onChange({
          name: `voice-note-${new Date().toISOString()}.webm`,
          url,
          mimeType,
          createdAt: new Date().toISOString(),
        });
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError("Microphone access is unavailable. Participants can still type, or you can deploy this on a browser with microphone permissions enabled.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!value?.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(value.url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = value.url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="audio-box">
      <div className="button-row">
        {!isRecording ? (
          <IconButton onClick={startRecording}>
            <Mic size={16} />
            Record voice note
          </IconButton>
        ) : (
          <IconButton onClick={stopRecording} variant="danger">
            <StopCircle size={16} />
            Stop recording
          </IconButton>
        )}

        {value?.url && (
          <>
            <IconButton onClick={togglePlayback} variant="secondary">
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Pause" : "Play"}
            </IconButton>
            <IconButton asLink href={value.url} download={value.name} variant="secondary">
              <Download size={16} />
              Download
            </IconButton>
            <IconButton onClick={() => onChange(undefined)} variant="ghost">
              <Trash2 size={16} />
              Remove
            </IconButton>
          </>
        )}
      </div>

      {isRecording && <p className="muted">Recording in progress. When you stop, the clip will appear below.</p>}
      {value?.url && (
        <div className="notice">
          <strong>Voice note ready</strong>
          <div className="muted">Saved in this browser session: {new Date(value.createdAt).toLocaleString()}</div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function QuestionResponseCard({
  question,
  value,
  onChange,
}: {
  question: { id: string; prompt: string; help?: string };
  value: TextAudioAnswer;
  onChange: (next: TextAudioAnswer) => void;
}) {
  const [mode, setMode] = useState<"text" | "voice">("text");

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="eyebrow">{question.id}</div>
          <h3>{question.prompt}</h3>
          {question.help && <p className="muted">{question.help}</p>}
        </div>
        <span className="pill">Response</span>
      </div>

      <div className="tab-row">
        <button className={`tab ${mode === "text" ? "active" : ""}`} onClick={() => setMode("text")} type="button">
          Text
        </button>
        <button className={`tab ${mode === "voice" ? "active" : ""}`} onClick={() => setMode("voice")} type="button">
          Voice note
        </button>
      </div>

      {mode === "text" ? (
        <textarea
          className="textarea"
          value={value.text}
          onChange={(e) => onChange({ ...value, text: e.target.value })}
          placeholder="Participant can type a response here..."
        />
      ) : (
        <AudioRecorder value={value.audio} onChange={(audio) => onChange({ ...value, audio })} />
      )}
    </section>
  );
}

function exportJson(payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `participant-response-${new Date().toISOString()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  value,
  onChange,
  options,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  type?: "text" | "select";
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {type === "select" ? (
        <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);

  const [consent, setConsent] = useLocalStorage("participant-consent", {
    participate: "",
    delivery: "",
    spokenLanguage: "",
    writtenLanguage: "",
    readingComfort: "",
  });

  const [demographics, setDemographics] = useLocalStorage<Record<string, string>>(
    "participant-demographics",
    Object.fromEntries(demographicConfig.map((field) => [field.id, ""]))
  );

  const [responses, setResponses] = useState<Record<string, TextAudioAnswer>>(
    Object.fromEntries(qualitativeQuestions.map((q) => [q.id, { text: "" }]))
  );

  const groupedResponses = useMemo(
    () => ({
      explore: qualitativeQuestions.filter((q) => q.group === "Explore"),
      engage: qualitativeQuestions.filter((q) => q.group === "Engage"),
      accelerate: qualitativeQuestions.filter((q) => q.group === "Accelerate"),
    }),
    []
  );

  const completion = useMemo(() => {
    const totalFields = 5 + demographicConfig.length + qualitativeQuestions.length;
    const consentDone = Object.values(consent).filter(Boolean).length;
    const demographicDone = Object.values(demographics).filter(Boolean).length;
    const qualitativeDone = qualitativeQuestions.filter(
      (q) => responses[q.id]?.text?.trim() || responses[q.id]?.audio?.url
    ).length;
    return Math.round(((consentDone + demographicDone + qualitativeDone) / totalFields) * 100);
  }, [consent, demographics, responses]);

  const responseCounts = useMemo(() => {
    const countByGroup = (group: string) =>
      qualitativeQuestions.filter(
        (q) => q.group === group && (responses[q.id]?.text?.trim() || responses[q.id]?.audio?.url)
      ).length;

    return {
      explore: countByGroup("Explore"),
      engage: countByGroup("Engage"),
      accelerate: countByGroup("Accelerate"),
    };
  }, [responses]);

  const payload = {
    exportedAt: new Date().toISOString(),
    consent,
    demographics,
    responses,
  };

  const sectionTitle = sectionMeta[currentSection]?.title;

  return (
    <div className="page-shell">
      <div className="layout">
        <aside className="sidebar card">
          <div className="sidebar-header">
            <h1>Participant response site</h1>
            <p className="muted">
              Demographics use structured fields. Interview responses can be captured as typed text, voice notes, or both.
            </p>
          </div>

          <div className="progress-wrap">
            <div className="progress-label">
              <span>Completion</span>
              <strong>{completion}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <nav className="nav-list">
            {sectionMeta.map((section, idx) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`nav-item ${idx === currentSection ? "active" : ""}`}
                  onClick={() => setCurrentSection(idx)}
                  type="button"
                >
                  <Icon size={16} />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="stats-list">
            <SectionBadge label="Explore" count={responseCounts.explore} />
            <SectionBadge label="Engage" count={responseCounts.engage} />
            <SectionBadge label="Accelerate" count={responseCounts.accelerate} />
          </div>
        </aside>

        <main className="content">
          <motion.div
            key={sectionTitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="stack"
          >
            <section className="card hero-card">
              <div className="hero-row">
                <div>
                  <div className="eyebrow">Interview prototype</div>
                  <h2>{sectionTitle}</h2>
                  <p className="muted">
                    This front end version is ready for GitHub and hosting. Text autosaves in the browser. Voice notes remain in the browser session unless you connect backend storage.
                  </p>
                </div>
                <IconButton onClick={() => exportJson(payload)} variant="secondary">
                  <Save size={16} />
                  Export JSON
                </IconButton>
              </div>
            </section>

            {currentSection === 0 && (
              <section className="card">
                <h3>Consent and language preferences</h3>
                <p className="muted">These fields can be used at the start of the interview before moving into the main schedule.</p>
                <div className="grid">
                  <Field
                    label="Do you agree to participate?"
                    type="select"
                    value={consent.participate}
                    onChange={(value) => setConsent({ ...consent, participate: value })}
                    options={["Yes", "No"]}
                  />
                  <Field
                    label="How would you prefer to engage?"
                    type="select"
                    value={consent.delivery}
                    onChange={(value) => setConsent({ ...consent, delivery: value })}
                    options={["I prefer to read", "I prefer questions read aloud"]}
                  />
                  <Field
                    label="Preferred spoken language"
                    value={consent.spokenLanguage}
                    onChange={(value) => setConsent({ ...consent, spokenLanguage: value })}
                  />
                  <Field
                    label="Preferred written language"
                    value={consent.writtenLanguage}
                    onChange={(value) => setConsent({ ...consent, writtenLanguage: value })}
                  />
                  <Field
                    label="Comfort with reading research materials in home language"
                    type="select"
                    value={consent.readingComfort}
                    onChange={(value) => setConsent({ ...consent, readingComfort: value })}
                    options={[
                      "Very comfortable",
                      "Somewhat comfortable",
                      "Not very comfortable",
                      "I prefer verbal communication",
                    ]}
                  />
                </div>
              </section>
            )}

            {currentSection === 1 && (
              <section className="card">
                <h3>Demographics</h3>
                <p className="muted">Structured dropdowns reduce burden and make later analysis easier.</p>
                <div className="grid">
                  {demographicConfig.map((field) => (
                    <Field
                      key={field.id}
                      label={field.label}
                      type={field.type as "text" | "select"}
                      value={demographics[field.id]}
                      onChange={(value) => setDemographics({ ...demographics, [field.id]: value })}
                      options={field.options}
                    />
                  ))}
                </div>
              </section>
            )}

            {currentSection === 2 &&
              groupedResponses.explore.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}

            {currentSection === 3 &&
              groupedResponses.engage.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}

            {currentSection === 4 &&
              groupedResponses.accelerate.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}

            {currentSection === 5 && (
              <>
                <section className="card notice-card">
                  <div className="notice-title">
                    <CheckCircle2 size={18} />
                    <span>Ready for pilot use</span>
                  </div>
                  <p className="muted">
                    This is a front end prototype. Text responses persist in local storage. Voice notes remain in the current browser session until you connect a database or storage backend.
                  </p>
                </section>

                <section className="card">
                  <h3>Response summary</h3>
                  <p className="muted">Use this page to review completion before exporting or wiring the form into a backend.</p>

                  <div className="summary-badges">
                    <SectionBadge label="Completion" count={completion} />
                    <SectionBadge
                      label="Text or audio answers"
                      count={qualitativeQuestions.filter((q) => responses[q.id]?.text?.trim() || responses[q.id]?.audio?.url).length}
                    />
                    <SectionBadge label="Demographic fields" count={Object.values(demographics).filter(Boolean).length} />
                  </div>

                  <div className="summary-list">
                    {qualitativeQuestions.map((q) => {
                      const answer = responses[q.id];
                      const hasText = !!answer?.text?.trim();
                      const hasAudio = !!answer?.audio?.url;
                      return (
                        <div key={q.id} className="summary-item">
                          <div className="summary-tags">
                            <span className="pill">{q.id}</span>
                            <span className="pill">{q.group}</span>
                            {hasText && <span className="pill filled">Text</span>}
                            {hasAudio && <span className="pill filled">Voice</span>}
                          </div>
                          <div className="summary-question">{q.prompt}</div>
                          {!hasText && !hasAudio ? (
                            <div className="muted">No response yet.</div>
                          ) : (
                            <div className="summary-content">
                              {hasText && <p className="summary-text">{answer.text}</p>}
                              {hasAudio && <div className="summary-audio muted">Voice note attached: {new Date(answer.audio!.createdAt).toLocaleString()}</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            <div className="footer-nav">
              <IconButton onClick={() => setCurrentSection((prev) => Math.max(prev - 1, 0))} variant="secondary" disabled={currentSection === 0}>
                <ChevronLeft size={16} />
                Previous
              </IconButton>
              <IconButton
                onClick={() => setCurrentSection((prev) => Math.min(prev + 1, sectionMeta.length - 1))}
                disabled={currentSection === sectionMeta.length - 1}
              >
                Next
                <ChevronRight size={16} />
              </IconButton>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
