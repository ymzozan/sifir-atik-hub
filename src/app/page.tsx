"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Smartphone,
  Trophy,
  LayoutDashboard,
  Camera,
  Loader2,
  CheckCircle2,
  Sparkles,
  Recycle,
  Leaf,
  Battery,
  Wifi,
  Signal,
  Award,
  TrendingUp,
  Users,
  Cloud,
  Activity,
  Medal,
  Crown,
  GlassWater,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  SIFIR ATIK HUB — Yapay Zeka Destekli Okullar Arası Oyunlaştırma
 *  Sıfır Atık Vakfı Özel Prototipidir
 * ------------------------------------------------------------------ */

type TabKey = "student" | "leaderboard" | "dashboard";

type School = {
  id: number;
  name: string;
  city: string;
  points: number;
  co2: number; // kg
  bottles: number;
};

type ActivityItem = {
  id: number;
  name: string;
  school: string;
  text: string;
  points: number;
  time: string;
};

// Yapay zekanın "tanıyabileceği" atık türleri (rastgele seçilir)
const WASTE_TYPES = [
  { label: "Plastik Şişe", points: 10, co2: 0.08, bottles: 1, icon: "🥤" },
  { label: "Cam Şişe", points: 15, co2: 0.3, bottles: 1, icon: "🍾" },
  { label: "Alüminyum Kutu", points: 12, co2: 0.15, bottles: 0, icon: "🥫" },
  { label: "Kağıt / Karton", points: 8, co2: 0.05, bottles: 0, icon: "📦" },
];

const STUDENT_NAMES = [
  "Ahmet",
  "Zeynep",
  "Mert",
  "Elif",
  "Can",
  "Defne",
  "Yusuf",
  "Ada",
  "Kerem",
  "Naz",
];

const INITIAL_SCHOOLS: School[] = [
  { id: 1, name: "Kadıköy Anadolu Lisesi", city: "İstanbul", points: 45000, co2: 3600, bottles: 41200 },
  { id: 2, name: "Ankara Fen Lisesi", city: "Ankara", points: 38500, co2: 3080, bottles: 35400 },
  { id: 3, name: "İzmir Bornova Lisesi", city: "İzmir", points: 31200, co2: 2496, bottles: 28900 },
  { id: 4, name: "Bursa Tofaş Fen Lisesi", city: "Bursa", points: 27600, co2: 2208, bottles: 24100 },
  { id: 5, name: "Eskişehir Atatürk Lisesi", city: "Eskişehir", points: 22150, co2: 1772, bottles: 19800 },
  { id: 6, name: "Antalya Aldemir Atilla Lisesi", city: "Antalya", points: 18400, co2: 1472, bottles: 16200 },
];

const STUDENT_SCHOOL_ID = 1; // Öğrencinin okulu: Kadıköy Anadolu Lisesi

const formatNumber = (n: number) =>
  new Intl.NumberFormat("tr-TR").format(Math.round(n));

/* ------------------------------------------------------------------ */

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabKey>("student");

  // Paylaşılan canlı durum
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [studentPoints, setStudentPoints] = useState<number>(120);
  const [studentItems, setStudentItems] = useState<number>(14);
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 1, name: "Zeynep", school: "Kadıköy Anadolu Lisesi", text: "2 plastik şişe dönüştürdü", points: 20, time: "az önce" },
    { id: 2, name: "Mert", school: "Ankara Fen Lisesi", text: "3 cam şişe dönüştürdü", points: 45, time: "1 dk önce" },
    { id: 3, name: "Elif", school: "İzmir Bornova Lisesi", text: "1 alüminyum kutu geri kazandı", points: 12, time: "2 dk önce" },
  ]);
  const activityId = useRef(100);

  // Toplam metrikler (okullardan türetilir)
  const totals = useMemo(() => {
    const points = schools.reduce((s, x) => s + x.points, 0);
    const co2 = schools.reduce((s, x) => s + x.co2, 0);
    const bottles = schools.reduce((s, x) => s + x.bottles, 0);
    // 1 puan ≈ 0.05 kg kabulüyle toplam kg
    const kg = Math.round(points * 0.05);
    return { points, co2, bottles, kg };
  }, [schools]);

  const studentSchool = schools.find((s) => s.id === STUDENT_SCHOOL_ID)!;

  // Bir geri dönüşüm olayını sisteme işler
  const registerRecycle = (
    schoolId: number,
    waste: (typeof WASTE_TYPES)[number],
    studentName: string
  ) => {
    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              points: s.points + waste.points,
              co2: s.co2 + waste.co2,
              bottles: s.bottles + waste.bottles,
            }
          : s
      )
    );
    const school =
      INITIAL_SCHOOLS.find((s) => s.id === schoolId)?.name ?? "Bir okul";
    activityId.current += 1;
    setActivities((prev) =>
      [
        {
          id: activityId.current,
          name: studentName,
          school,
          text: `1 ${waste.label.toLowerCase()} dönüştürdü`,
          points: waste.points,
          time: "az önce",
        },
        ...prev,
      ].slice(0, 12)
    );
  };

  // Yönetim panelinde diğer okullardan "canlı" simüle aktivite akışı
  useEffect(() => {
    const interval = setInterval(() => {
      const school =
        INITIAL_SCHOOLS[Math.floor(Math.random() * INITIAL_SCHOOLS.length)];
      const waste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
      const name =
        STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)];
      registerRecycle(school.id, waste, name);
    }, 4500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
        {activeTab === "student" && (
          <StudentScreen
            studentPoints={studentPoints}
            setStudentPoints={setStudentPoints}
            studentItems={studentItems}
            setStudentItems={setStudentItems}
            studentSchool={studentSchool}
            onRecycle={registerRecycle}
          />
        )}
        {activeTab === "leaderboard" && <Leaderboard schools={schools} />}
        {activeTab === "dashboard" && (
          <Dashboard totals={totals} schools={schools} activities={activities} />
        )}
      </main>

      <Footer />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  ÜST BAŞLIK
 * ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 shadow-lg shadow-emerald-500/30">
            <Recycle className="h-6 w-6 text-white" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-800 sm:text-xl">
              Sıfır Atık <span className="text-emerald-600">Hub</span>
            </h1>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">
              Yapay Zeka Destekli Okullar Arası Oyunlaştırma
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            Canlı MVP
          </span>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ *
 *  ALT GEZİNME (TAB BAR)
 * ------------------------------------------------------------------ */

const TABS: { key: TabKey; label: string; icon: typeof Smartphone }[] = [
  { key: "student", label: "Öğrenci Uygulaması", icon: Smartphone },
  { key: "leaderboard", label: "Liderlik Tablosu", icon: Trophy },
  { key: "dashboard", label: "Vakıf Paneli", icon: LayoutDashboard },
];

function TabBar({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md lg:inset-x-auto lg:left-1/2 lg:bottom-6 lg:w-auto lg:-translate-x-1/2 lg:rounded-2xl lg:border lg:px-2 lg:py-2">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 lg:max-w-none lg:gap-2">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`group flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all lg:flex-row lg:gap-2 lg:text-sm ${
                active
                  ? "bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-md shadow-emerald-500/30"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "" : "group-hover:scale-110"} transition-transform`}
                strokeWidth={2.2}
              />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 *  EKRAN 1 — ÖĞRENCİ MOBİL UYGULAMASI (MOCKUP)
 * ------------------------------------------------------------------ */

type Phase = "idle" | "analyzing" | "success";

function StudentScreen({
  studentPoints,
  setStudentPoints,
  studentItems,
  setStudentItems,
  studentSchool,
  onRecycle,
}: {
  studentPoints: number;
  setStudentPoints: React.Dispatch<React.SetStateAction<number>>;
  studentItems: number;
  setStudentItems: React.Dispatch<React.SetStateAction<number>>;
  studentSchool: School;
  onRecycle: (
    schoolId: number,
    waste: (typeof WASTE_TYPES)[number],
    studentName: string
  ) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastWaste, setLastWaste] = useState<(typeof WASTE_TYPES)[number] | null>(
    null
  );
  const [pointBump, setPointBump] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const handleUpload = () => {
    if (phase === "analyzing") return;
    const waste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
    setLastWaste(waste);
    setPhase("analyzing");

    timers.current.push(
      setTimeout(() => {
        setPhase("success");
        setStudentPoints((p) => p + waste.points);
        setStudentItems((c) => c + 1);
        setPointBump(true);
        onRecycle(STUDENT_SCHOOL_ID, waste, "Sen");
        timers.current.push(setTimeout(() => setPointBump(false), 600));
        // 4 sn sonra başlangıç durumuna dön
        timers.current.push(setTimeout(() => setPhase("idle"), 4200));
      }, 2000)
    );
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {/* Açıklama tarafı */}
      <div className="order-2 lg:order-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" /> Öğrenci Deneyimi
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
          Atığını çek, <span className="text-emerald-600">yapay zeka</span>{" "}
          tanısın, okuluna <span className="text-sky-600">puan</span> kazandır.
        </h2>
        <p className="mt-4 max-w-md text-slate-600">
          Öğrenci geri dönüştürdüğü atığın fotoğrafını yükler. Görüntü işleme
          modeli atık türünü saniyeler içinde tanır, doğrular ve okul puanına
          otomatik işler. Aşağıdaki telefonda{" "}
          <strong className="text-slate-800">“Fotoğraf Çek / Atık Yükle”</strong>{" "}
          butonunu deneyin.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <MiniStat icon={Award} label="Senin Puanın" value={formatNumber(studentPoints)} bump={pointBump} />
          <MiniStat icon={Recycle} label="Atığın" value={formatNumber(studentItems)} />
          <MiniStat icon={Leaf} label="Seviye" value="Yeşil Kahraman" small />
        </div>
      </div>

      {/* Telefon çerçevesi */}
      <div className="order-1 flex justify-center lg:order-2">
        <PhoneFrame>
          <div className="flex h-full flex-col bg-gradient-to-b from-emerald-50 to-white">
            {/* Uygulama üst bilgi */}
            <div className="bg-gradient-to-br from-emerald-500 to-sky-500 px-5 pb-5 pt-3 text-white">
              <div className="flex items-center justify-between text-xs opacity-90">
                <span>Sıfır Atık Hub</span>
                <span>09:41</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90">Merhaba Kahraman 👋</p>
                  <p className="text-sm font-semibold">{studentSchool.name}</p>
                </div>
                <div
                  className={`rounded-2xl bg-white/20 px-3 py-2 text-right backdrop-blur ${
                    pointBump ? "animate-pop-in" : ""
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-wide opacity-90">
                    Puanın
                  </p>
                  <p className="text-xl font-extrabold leading-none">
                    {formatNumber(studentPoints)}
                  </p>
                </div>
              </div>
            </div>

            {/* İçerik alanı */}
            <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-6">
              {phase === "idle" && <IdleState />}
              {phase === "analyzing" && <AnalyzingState waste={lastWaste} />}
              {phase === "success" && lastWaste && (
                <SuccessState waste={lastWaste} />
              )}
            </div>

            {/* Alt buton */}
            <div className="border-t border-slate-100 bg-white px-5 py-4">
              <button
                onClick={handleUpload}
                disabled={phase === "analyzing"}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                  phase === "analyzing"
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : "bg-gradient-to-r from-emerald-500 to-sky-500 shadow-emerald-500/40 hover:from-emerald-600 hover:to-sky-600"
                }`}
              >
                {phase === "analyzing" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Analiz ediliyor…
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" /> Fotoğraf Çek / Atık Yükle
                  </>
                )}
              </button>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Sıfır Atık Vakfı Özel Prototipidir
              </p>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

function IdleState() {
  return (
    <div className="animate-float-up flex flex-col items-center text-center">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/60">
        <Camera className="h-14 w-14 text-emerald-400" strokeWidth={1.6} />
        <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg">
          <Sparkles className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-700">
        Atığını çerçeveye al
      </p>
      <p className="mt-1 max-w-[14rem] text-xs text-slate-500">
        Şişe, kutu veya kağıt — yapay zeka türünü otomatik tanıyacak.
      </p>
    </div>
  );
}

function AnalyzingState({
  waste,
}: {
  waste: (typeof WASTE_TYPES)[number] | null;
}) {
  return (
    <div className="animate-float-up flex flex-col items-center text-center">
      <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 to-sky-100">
        <div className="absolute inset-0 rounded-3xl border-2 border-emerald-300/60" />
        <Loader2 className="h-16 w-16 animate-spin text-emerald-500" strokeWidth={1.6} />
        {waste && <span className="absolute text-3xl">{waste.icon}</span>}
        {/* Tarama çizgisi efekti */}
        <div className="absolute inset-x-3 top-1/2 h-0.5 animate-pulse rounded-full bg-emerald-500/70 shadow-[0_0_12px_2px] shadow-emerald-400" />
      </div>
      <p className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-700">
        <Sparkles className="h-4 w-4 animate-pulse" />
        Yapay Zeka Atığı Analiz Ediyor…
      </p>
      <div className="mt-3 h-1.5 w-44 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full w-1/3 animate-[float-up_1.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" />
      </div>
      <p className="mt-2 text-[11px] text-slate-500">Görüntü modeli çalışıyor…</p>
    </div>
  );
}

function SuccessState({ waste }: { waste: (typeof WASTE_TYPES)[number] }) {
  return (
    <div className="animate-pop-in flex flex-col items-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" strokeWidth={2} />
        <span className="absolute -right-1 -top-1 text-2xl">{waste.icon}</span>
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-emerald-700">BAŞARILI!</h3>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        {waste.label} Onaylandı.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-3 text-white shadow-lg shadow-emerald-500/30">
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-bold">
          Okulunuza +{waste.points} Puan Kazandırdınız!
        </span>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        ~{waste.co2.toFixed(2)} kg CO₂ emisyonu engellendi 🌍
      </p>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  small,
  bump,
}: {
  icon: typeof Award;
  label: string;
  value: string;
  small?: boolean;
  bump?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-transform ${
        bump ? "animate-pop-in" : ""
      }`}
    >
      <Icon className="h-4 w-4 text-emerald-500" />
      <p className={`mt-2 font-extrabold text-slate-800 ${small ? "text-xs" : "text-lg"}`}>
        {value}
      </p>
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[640px] w-[320px] rounded-[2.8rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl shadow-slate-900/40">
      {/* Çentik */}
      <div className="absolute left-1/2 top-0 z-20 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
      {/* Durum çubuğu ikonları */}
      <div className="absolute right-6 top-2 z-20 flex items-center gap-1 text-white">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-3.5 w-3.5" />
      </div>
      <div className="h-full w-full overflow-hidden rounded-[2.1rem] bg-white">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  EKRAN 2 — OKULLAR ARASI LİDERLİK TABLOSU
 * ------------------------------------------------------------------ */

function Leaderboard({ schools }: { schools: School[] }) {
  const ranked = [...schools].sort((a, b) => b.points - a.points);
  const max = ranked[0]?.points ?? 1;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
          <Trophy className="h-3.5 w-3.5" /> Türkiye Geneli
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800">
          Okullar Arası Liderlik Tablosu
        </h2>
        <p className="mt-2 text-slate-600">
          En çok atık toplayan okullar. Öğrenciler atık yükledikçe puanlar{" "}
          <span className="font-semibold text-emerald-600">canlı</span> güncellenir.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {ranked.map((school, i) => {
          const rank = i + 1;
          const isTop = rank === 1;
          return (
            <div
              key={school.id}
              className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all ${
                isTop
                  ? "border-amber-200 bg-gradient-to-r from-amber-50 to-white"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <RankBadge rank={rank} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-bold text-slate-800">
                      {school.name}
                    </h3>
                    {isTop && (
                      <Crown className="h-4 w-4 shrink-0 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{school.city}</p>

                  {/* İlerleme çubuğu */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(8, (school.points / max) * 100)}%` }}
                    />
                  </div>

                  {/* Detay etiketleri */}
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <Cloud className="h-3.5 w-3.5" />
                      {formatNumber(school.co2)} kg CO₂ kurtarıldı
                    </span>
                    <span className="inline-flex items-center gap-1 text-sky-600">
                      <GlassWater className="h-3.5 w-3.5" />
                      {formatNumber(school.bottles)} şişe
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xl font-extrabold text-slate-800 tabular-nums">
                    {formatNumber(school.points)}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Puan
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Sıfır Atık Vakfı Özel Prototipidir
      </p>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/40",
    2: "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-slate-400/40",
    3: "bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-orange-500/40",
  };
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold shadow-md ${
        styles[rank] ?? "bg-slate-100 text-slate-500 shadow-none"
      }`}
    >
      {rank <= 3 ? <Medal className="h-6 w-6" /> : rank}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  EKRAN 3 — "YÜCEL ABİ" VAKIF YÖNETİM PANELİ (DASHBOARD)
 * ------------------------------------------------------------------ */

function Dashboard({
  totals,
  schools,
  activities,
}: {
  totals: { points: number; co2: number; bottles: number; kg: number };
  schools: School[];
  activities: ActivityItem[];
}) {
  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Vakıf Yönetimi
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800">
            “Yücel Abi” Yönetim Paneli
          </h2>
          <p className="mt-1 text-slate-600">
            Türkiye geneli gerçek zamanlı etki göstergeleri.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:mt-0">
          <Activity className="h-3.5 w-3.5" /> Canlı veri akışı aktif
        </div>
      </div>

      {/* Büyük metrik kartları */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={Recycle}
          label="Toplam Kurtarılan Atık"
          value={`${formatNumber(totals.kg)} kg`}
          trend="+12,4% bu ay"
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard
          icon={Users}
          label="Aktif Öğrenci Sayısı"
          value={formatNumber(48250)}
          trend="+1.180 yeni katılım"
          gradient="from-sky-500 to-indigo-600"
        />
        <MetricCard
          icon={Cloud}
          label="Engellenen Karbon Emisyonu"
          value={`${formatNumber(totals.co2)} kg CO₂`}
          trend="≈ 720 ağaç eşdeğeri"
          gradient="from-violet-500 to-fuchsia-600"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Grafik */}
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>

        {/* Canlı aktivite akışı */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* En iyi okullar mini tablo */}
      <TopSchools schools={schools} />

      <p className="mt-8 text-center text-xs text-slate-400">
        Sıfır Atık Vakfı Özel Prototipidir
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  gradient,
}: {
  icon: typeof Recycle;
  label: string;
  value: string;
  trend: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 transition-transform group-hover:scale-125`}
      />
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
      >
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800 tabular-nums">
        {value}
      </p>
      <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <TrendingUp className="h-3.5 w-3.5" /> {trend}
      </p>
    </div>
  );
}

/* Tailwind ile çizilmiş bar grafik */
function WeeklyChart() {
  const data = [
    { day: "Pzt", v: 58 },
    { day: "Sal", v: 72 },
    { day: "Çar", v: 64 },
    { day: "Per", v: 86 },
    { day: "Cum", v: 95 },
    { day: "Cmt", v: 48 },
    { day: "Paz", v: 40 },
  ];
  const max = Math.max(...data.map((d) => d.v));

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Zap className="h-4 w-4 text-emerald-500" /> Haftalık Geri Dönüşüm
          </h3>
          <p className="text-xs text-slate-500">Günlük toplanan atık (bin adet)</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <ArrowUpRight className="h-3.5 w-3.5" /> %18 artış
        </span>
      </div>

      <div className="mt-6 flex h-52 items-end justify-between gap-2 sm:gap-3">
        {data.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className="group relative w-full max-w-[2.5rem] rounded-t-lg bg-gradient-to-t from-emerald-500 to-sky-400 transition-all duration-500 hover:from-emerald-600 hover:to-sky-500"
                style={{ height: `${(d.v / max) * 100}%` }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {d.v}k
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Activity className="h-4 w-4 text-sky-500" /> Canlı Aktivite Akışı
        </h3>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-hidden">
        {activities.slice(0, 7).map((a) => (
          <div
            key={a.id}
            className="animate-float-up flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-xs font-bold text-white">
              {a.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-700">
                <span className="font-bold text-slate-900">{a.name}</span>{" "}
                <span className="text-slate-500">({a.school})</span> {a.text}
              </p>
              <p className="text-[11px] text-slate-400">{a.time}</p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              +{a.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopSchools({ schools }: { schools: School[] }) {
  const ranked = [...schools].sort((a, b) => b.points - a.points).slice(0, 5);
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Trophy className="h-4 w-4 text-amber-500" /> Öne Çıkan Okullar
        </h3>
        <span className="text-xs text-slate-400">İlk 5</span>
      </div>
      <div className="divide-y divide-slate-50">
        {ranked.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3">
            <span className="w-5 text-sm font-bold text-slate-400">{i + 1}</span>
            <span className="flex-1 truncate text-sm font-semibold text-slate-700">
              {s.name}
            </span>
            <span className="hidden text-xs text-sky-600 sm:inline">
              {formatNumber(s.bottles)} şişe
            </span>
            <span className="hidden text-xs text-emerald-600 sm:inline">
              {formatNumber(s.co2)} kg CO₂
            </span>
            <span className="w-24 text-right text-sm font-extrabold text-slate-800 tabular-nums">
              {formatNumber(s.points)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  ALT BİLGİ
 * ------------------------------------------------------------------ */

function Footer() {
  return (
    <div className="mx-auto mb-24 w-full max-w-7xl px-4 sm:px-6 lg:mb-0">
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 text-center backdrop-blur sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs font-semibold text-slate-600">
          <span className="text-emerald-600">Sıfır Atık Hub</span> — Yapay Zeka
          Destekli Okullar Arası Oyunlaştırma Modeli
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Leaf className="h-3.5 w-3.5 text-emerald-500" /> Sıfır Atık Vakfı
          Özel Prototipidir
        </p>
      </div>
    </div>
  );
}
