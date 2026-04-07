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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  {
    id: "C2",
    prompt: "What kind of information or data would help you make a more informed choice about meaningful work?",
  },
  {
    id: "C3",
    prompt: "What subjects or topics do you enjoy learning about?",
    help: "You may also explain what skills you currently have and how you learned them.",
  },
  {
    id: "C4",
    prompt: "What types of careers or skills are needed in the region where you live?",
  },
  {
    id: "C5",
    prompt: "What expectations do your family or community have about your work or career choices?",
  },
  {
    id: "C6",
    prompt: "I would like to hear more about the role of technology in your career or work considerations.",
  },
  {
    id: "C7",
    prompt: "Where are you getting your information from about possible jobs or study opportunities?",
  },
];

const engageQuestions = [
  {
    id: "D1",
    prompt: "I am interested to hear about how you get support and guidance regarding your career or work opportunities.",
  },
  {
    id: "D2",
    prompt: "What kind of job or opportunity are you actively preparing yourself for at the moment?",
  },
  {
    id: "D3",
    prompt: "I would like to talk about the practicalities of searching for a job. Please tell me about any experiences you have had.",
  },
  {
    id: "D4",
    prompt: "How would you go about looking for new work or income opportunities if you had to start today?",
  },
  {
    id: "D5",
    prompt: "Would you consider relocating for a better job or opportunity? Why or why not?",
  },
  {
    id: "D6",
    prompt: "How confident do you feel about your chances of finding meaningful work or income?",
  },
];

const accelerateQuestions = [
  {
    id: "E1",
    prompt: "I would like to hear about any work experience you may have had, either as an employee or as an entrepreneur.",
  },
  {
    id: "E2",
    prompt: "In what ways have your expectations changed around getting work or generating an income? What do you wish someone told you earlier?",
  },
  {
    id: "E3",
    prompt: "Have you ever accessed counselling, mentoring, or career support? If so, what was useful and what was not?",
  },
  {
    id: "E4",
    prompt: "Tell me about opportunities to grow in your current job, field, or business.",
  },
  {
    id: "E5",
    prompt: "How are you building your professional profile or network?",
  },
  {
    id: "E6",
    prompt: "How are online platforms or online communities shaping how you build or find work?",
  },
  {
    id: "E7",
    prompt: "In what ways does your current field, job, or role allow you to be entrepreneurial?",
  },
  {
    id: "E8",
    prompt: "If you had access to a tool or platform to help you choose a job or career, what would this look like to you?",
  },
];

const qualitativeQuestions = [
  ...exploreQuestions.map((q) => ({ ...q, group: "Explore" })),
  ...engageQuestions.map((q) => ({ ...q, group: "Engage" })),
  ...accelerateQuestions.map((q) => ({ ...q, group: "Accelerate" })),
];

const demographicConfig = [
  {
    id: "ageBand",
    label: "Age band",
    type: "select",
    options: ["Under 18", "18 to 24", "25 to 34", "35 to 44", "45 to 54", "55+", "Prefer not to say"],
  },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Non binary", "Prefer not to say", "Other"],
  },
  {
    id: "nationality",
    label: "Nationality or citizenship",
    type: "text",
  },
  {
    id: "locationType",
    label: "Where do you live?",
    type: "select",
    options: ["City", "Suburb", "Township", "Village", "Farm", "Other"],
  },
  {
    id: "livingWith",
    label: "Who do you live with?",
    type: "select",
    options: ["Alone", "One parent", "Both parents", "Caregiver", "Partner", "Friends or roommates", "Other"],
  },
  {
    id: "currentSituation",
    label: "Current situation",
    type: "select",
    options: ["In school", "In tertiary", "Unemployed", "Informally employed", "Employed", "Self employed"],
  },
  {
    id: "education",
    label: "Highest level of education completed",
    type: "select",
    options: ["None", "Primary", "Secondary", "Matric", "Diploma", "Degree", "Honours", "Masters", "PhD"],
  },
  {
    id: "grantSupport",
    label: "Do you receive social grants or financial support?",
    type: "select",
    options: ["Yes", "No", "Prefer not to say"],
  },
  {
    id: "incomeStatus",
    label: "Do you currently earn any income?",
    type: "select",
    options: ["Yes", "No", "Prefer not to say"],
  },
  {
    id: "incomeBand",
    label: "Monthly income band",
    type: "select",
    options: ["No income", "Under R1,000", "R1,000 to R4,999", "R5,000 to R9,999", "R10,000 to R19,999", "R20,000+", "Prefer not to say"],
  },
  {
    id: "incomeSource",
    label: "Main source of income or work",
    type: "select",
    options: ["Formal employment", "Informal work", "Self employment", "Gig work", "Mixed income", "Family support", "Other"],
  },
];

function SectionBadge({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm">
      <span className="font-medium">{label}</span>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
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
      // no-op
    }
  }, [key, value]);

  return [value, setValue] as const;
}

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
      setError("Microphone access is unavailable in this preview. Participants can still type, or you can connect this form to a live browser deployment.");
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {!isRecording ? (
          <Button type="button" onClick={startRecording} className="rounded-2xl">
            <Mic className="mr-2 h-4 w-4" />
            Record voice note
          </Button>
        ) : (
          <Button type="button" onClick={stopRecording} variant="destructive" className="rounded-2xl">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop recording
          </Button>
        )}

        {value?.url && (
          <>
            <Button type="button" variant="outline" onClick={togglePlayback} className="rounded-2xl">
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button type="button" variant="outline" asChild className="rounded-2xl">
              <a href={value.url} download={value.name}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            <Button type="button" variant="ghost" onClick={() => onChange(undefined)} className="rounded-2xl">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </>
        )}
      </div>

      {isRecording && <p className="text-sm text-muted-foreground">Recording in progress. When you stop, the clip will appear below.</p>}
      {value?.url && (
        <div className="rounded-xl border bg-background p-3 text-sm">
          <div className="font-medium">Voice note ready</div>
          <div className="text-muted-foreground">Saved locally in this browser session: {new Date(value.createdAt).toLocaleString()}</div>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
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
  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{question.id}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6 text-foreground/80">{question.prompt}</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Response
          </Badge>
        </div>
        {question.help && <p className="text-sm text-muted-foreground">{question.help}</p>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl">
            <TabsTrigger value="text" className="rounded-2xl">Text</TabsTrigger>
            <TabsTrigger value="voice" className="rounded-2xl">Voice note</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="mt-4">
            <Textarea
              value={value.text}
              onChange={(e) => onChange({ ...value, text: e.target.value })}
              placeholder="Participant can type a response here..."
              className="min-h-[160px] rounded-2xl"
            />
          </TabsContent>
          <TabsContent value="voice" className="mt-4">
            <AudioRecorder value={value.audio} onChange={(audio) => onChange({ ...value, audio })} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function exportJson(payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `participant-response-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ParticipantVoiceTextCaptureApp() {
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
  const [responses, setResponses] = useState<Record<string, TextAudioAnswer>>(() =>
    Object.fromEntries(qualitativeQuestions.map((q) => [q.id, { text: "" }]))
  );

  const groupedResponses = useMemo(() => {
    return {
      explore: qualitativeQuestions.filter((q) => q.group === "Explore"),
      engage: qualitativeQuestions.filter((q) => q.group === "Engage"),
      accelerate: qualitativeQuestions.filter((q) => q.group === "Accelerate"),
    };
  }, []);

  const completion = useMemo(() => {
    const totalFields =
      5 +
      demographicConfig.length +
      qualitativeQuestions.length;

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

  const nextSection = () => setCurrentSection((prev) => Math.min(prev + 1, sectionMeta.length - 1));
  const prevSection = () => setCurrentSection((prev) => Math.max(prev - 1, 0));

  const sectionTitle = sectionMeta[currentSection]?.title;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit rounded-3xl border shadow-sm lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle className="text-2xl">Participant response site</CardTitle>
            <CardDescription>
              Demographics use structured fields. Interview responses can be captured as typed text, voice notes, or both.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </div>

            <div className="space-y-2">
              {sectionMeta.map((section, idx) => {
                const Icon = section.icon;
                const active = idx === currentSection;
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(idx)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      active ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>

            <Separator />

            <div className="grid gap-2">
              <SectionBadge label="Explore" count={responseCounts.explore} />
              <SectionBadge label="Engage" count={responseCounts.engage} />
              <SectionBadge label="Accelerate" count={responseCounts.accelerate} />
            </div>
          </CardContent>
        </Card>

        <motion.div
          key={sectionTitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <CardTitle className="text-3xl">{sectionTitle}</CardTitle>
                  <CardDescription className="mt-2 max-w-3xl text-base leading-7">
                    This prototype is designed for interview or self completion. Demographic items are structured. Open ended items can be answered by text, voice note, or both.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-2xl" onClick={() => exportJson(payload)}>
                    <Save className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {currentSection === 0 && (
            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle>Consent and language preferences</CardTitle>
                <CardDescription>These fields can be used at the start of the interview before moving into the main schedule.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Do you agree to participate?</Label>
                  <Select value={consent.participate} onValueChange={(value) => setConsent({ ...consent, participate: value })}>
                    <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>How would you prefer to engage?</Label>
                  <Select value={consent.delivery} onValueChange={(value) => setConsent({ ...consent, delivery: value })}>
                    <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I prefer to read">I prefer to read</SelectItem>
                      <SelectItem value="I prefer questions read aloud">I prefer questions read aloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred spoken language</Label>
                  <Input
                    value={consent.spokenLanguage}
                    onChange={(e) => setConsent({ ...consent, spokenLanguage: e.target.value })}
                    placeholder="Enter language"
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred written language</Label>
                  <Input
                    value={consent.writtenLanguage}
                    onChange={(e) => setConsent({ ...consent, writtenLanguage: e.target.value })}
                    placeholder="Enter language"
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Comfort with reading research materials in home language</Label>
                  <Select value={consent.readingComfort} onValueChange={(value) => setConsent({ ...consent, readingComfort: value })}>
                    <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Very comfortable">Very comfortable</SelectItem>
                      <SelectItem value="Somewhat comfortable">Somewhat comfortable</SelectItem>
                      <SelectItem value="Not very comfortable">Not very comfortable</SelectItem>
                      <SelectItem value="I prefer verbal communication">I prefer verbal communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentSection === 1 && (
            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>Structured dropdowns reduce burden and make later analysis easier.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                {demographicConfig.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.label}</Label>
                    {field.type === "select" ? (
                      <Select value={demographics[field.id]} onValueChange={(value) => setDemographics({ ...demographics, [field.id]: value })}>
                        <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={demographics[field.id]}
                        onChange={(e) => setDemographics({ ...demographics, [field.id]: e.target.value })}
                        placeholder="Type response"
                        className="rounded-2xl"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {currentSection === 2 && (
            <div className="space-y-5">
              {groupedResponses.explore.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}
            </div>
          )}

          {currentSection === 3 && (
            <div className="space-y-5">
              {groupedResponses.engage.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}
            </div>
          )}

          {currentSection === 4 && (
            <div className="space-y-5">
              {groupedResponses.accelerate.map((question) => (
                <QuestionResponseCard
                  key={question.id}
                  question={question}
                  value={responses[question.id] || { text: "" }}
                  onChange={(next) => setResponses((prev) => ({ ...prev, [question.id]: next }))}
                />
              ))}
            </div>
          )}

          {currentSection === 5 && (
            <div className="space-y-6">
              <Alert className="rounded-3xl">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Ready for pilot use</AlertTitle>
                <AlertDescription>
                  This is a front end prototype. Text responses persist in local storage. Voice notes remain in the current browser session until you connect a database or storage backend.
                </AlertDescription>
              </Alert>

              <Card className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle>Response summary</CardTitle>
                  <CardDescription>Use this page to review completion before exporting or wiring the form into a backend.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <SectionBadge label="Completion" count={completion} />
                    <SectionBadge label="Text or audio answers" count={qualitativeQuestions.filter((q) => responses[q.id]?.text?.trim() || responses[q.id]?.audio?.url).length} />
                    <SectionBadge label="Demographic fields" count={Object.values(demographics).filter(Boolean).length} />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    {qualitativeQuestions.map((q) => {
                      const answer = responses[q.id];
                      const hasText = !!answer?.text?.trim();
                      const hasAudio = !!answer?.audio?.url;
                      return (
                        <div key={q.id} className="rounded-2xl border p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{q.id}</Badge>
                            <Badge variant="secondary">{q.group}</Badge>
                            {hasText && <Badge>Text</Badge>}
                            {hasAudio && <Badge>Voice</Badge>}
                          </div>
                          <div className="text-sm font-medium">{q.prompt}</div>
                          {!hasText && !hasAudio ? (
                            <div className="mt-2 text-sm text-muted-foreground">No response yet.</div>
                          ) : (
                            <div className="mt-2 space-y-2">
                              {hasText && <p className="rounded-xl bg-muted/40 p-3 text-sm leading-6">{answer.text}</p>}
                              {hasAudio && (
                                <div className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
                                  Voice note attached: {new Date(answer.audio!.createdAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={prevSection} disabled={currentSection === 0} className="rounded-2xl">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={nextSection} disabled={currentSection === sectionMeta.length - 1} className="rounded-2xl">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
