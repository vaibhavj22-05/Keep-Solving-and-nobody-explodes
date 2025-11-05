import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

import {
  Book,
  Zap,
  AlertTriangle,
  Download,
  Beaker,
  Cable,
  Lightbulb,
  Cpu,
} from "lucide-react";

export default function ExpertPage() {
  const [activeModule, setActiveModule] = useState("wires");
  const [glitch, setGlitch] = useState(false);

  // Simulate glitch effect
  useState(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 4000);
    return () => clearInterval(interval);
  });

  const navigate = useNavigate();

useEffect(() => {
  socket.on("promptQuestion", (data) => {
    localStorage.setItem("currentQuestion", JSON.stringify(data));
    // navigate("/expert-question");
  });

  return () => socket.off("promptQuestion");
}, []);

  const modules = [
    {
      id: "wires",
      name: "Tangling Wires",
      icon: <Cable className="w-6 h-6" />,
      color: "red",
    },
    {
      id: "chemical",
      name: "Chemical Chaos",
      icon: <Beaker className="w-6 h-6" />,
      color: "cyan",
    },
    {
      id: "light",
      name: "Light Merge",
      icon: <Lightbulb className="w-6 h-6" />,
      color: "yellow",
    },
    {
      id: "circuit",
      name: "Circuit Solver",
      icon: <Cpu className="w-6 h-6" />,
      color: "green",
    },
  ];

  const moduleContent = {
  wires: {
  title: "Tangling Wires",
  description:
    "The Tangling Wires module presents 3–5 tangled colored wires. Each wire can be Red, Blue, Green, Yellow, White, or Black. The Defuser must identify and cut the correct wire(s) based on the color configuration and the numerical result from the Question Bank.",
  cases: [
    {
      title: "3-Wire Case",
      rules: [
        {
          name: "Rule 1: Two Red Wires",
          condition: "If there are exactly two red wires",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If the answer is ODD → Cut the FIRST wire",
            "If the answer is EVEN → Cut the LAST wire",
          ],
        },
        {
          name: "Rule 2: Blue and Green Adjacent",
          condition:
            "If Blue and Green wires are directly next to each other",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If the answer is a MULTIPLE OF 3 → Cut the BLUE wire",
            "If NOT a multiple of 3 → Cut the GREEN wire",
          ],
        },
        {
          name: "Rule 3: Default Case",
          condition: "If neither of the above conditions apply",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If the answer is GREATER THAN 5 → Cut the MIDDLE wire",
            "If the answer is LESS THAN OR EQUAL TO 5 → Cut the LAST wire",
          ],
        },
      ],
    },
    {
      title: "4-Wire Case",
      rules: [
        {
          name: "Rule 1: No Yellow Wire",
          condition: "If there are no yellow wires present",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If answer is MULTIPLE OF 2 AND 3 → Cut the 1st wire",
            "If answer is MULTIPLE OF 2 ONLY → Cut the 1st wire",
            "If answer is MULTIPLE OF 3 ONLY → Cut the 2nd wire",
            "If none apply → Cut the 2nd wire",
          ],
        },
        {
          name: "Rule 2: Two or More Green Wires",
          condition: "If there are two or more green wires",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If answer is EVEN → Cut the FIRST green wire",
            "If answer is ODD → Cut the RIGHTMOST green wire",
          ],
        },
        {
          name: "Rule 3: Default Case",
          condition: "If neither Rule 1 nor Rule 2 applies",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If answer is EVEN → Cut the FIRST wire",
            "If answer is ODD → Cut the SECOND wire",
          ],
        },
      ],
    },
    {
      title: "5-Wire Case",
      rules: [
        {
          name: "Rule 1: Single Black or Red Wire",
          condition: "If there is exactly one Black or one Red wire",
          steps: [
            "→ Solve Question [no.] from the Question Bank",
            "If only one BLACK wire: Take cube root of answer → Round → Cut that wire number",
            "If only one RED wire: Take square root of answer → Round → Cut that wire number",
          ],
        },
        {
          name: "Rule 2: 3 Wires of Same Color + 2 Different",
          condition:
            "If one color appears 3 times and the remaining 2 wires are different",
          steps: [
            "If dominant color is RED → Cut the LAST Red wire",
            "If dominant color is BLUE → Cut the SECOND wire",
            "Else → Identify 3rd Black wire; Cut the unique color that appears BEFORE it",
          ],
        },
        {
          name: "Rule 3: 2 Same + 2 Same + 1 Unique",
          condition:
            "If there are two colors that appear twice and one color that appears once",
          steps: [
            "→ Identify the unique wire and its position",
            "If the unique wire is in position 3 → Cut it",
            "If unique wire is in position 1 or 5 → Cut the first wire of the opposite color pair",
            "Otherwise → Cut the 4th wire",
          ],
        },
        {
          name: "Rule 4: 2 Same + 3 Different",
          condition:
            "If one color repeats twice and the rest are all different",
          steps: [
            "If repeated color is RED → Cut the FIRST Red wire",
            "If repeated color is BLUE → Cut the FIRST Blue wire",
            "If repeated color is GREEN → Cut the MIDDLE (3rd) wire",
            "Else → Cut the LAST wire",
          ],
        },
        {
          name: "Rule 5: All 5 Wires Different Colors",
          condition: "If all wires are unique colors",
          steps: [
            "If 1st wire is a PRIMARY color (Red, Blue, Yellow) → Cut LAST wire",
            "If 3rd wire is Green (secondary color) → Cut MIDDLE wire",
            "If last wire is Red → Cut 3rd wire",
            "Otherwise → Cut wire equal to the Question Bank answer number",
          ],
        },
      ],
    },
  ],
  notes: [
    "Always count wires from TOP to BOTTOM (or LEFT to RIGHT).",
    "Follow rules in order. The first true condition determines which wire to cut.",
    "Question Bank answers influence which wire(s) are correct.",
    "If unclear, the fallback is always the first wire.",
  ]},
chemical : {
  title: "Chemical Chaos",
  description:
    "The Chemical Chaos module presents 3-5 colored beakers arranged on a lab counter. The Defuser must describe each beaker's appearance (color, label, reactions) to determine correct mixing order.",
  visualClues: [
    { observation: "Red liquid", type: "acid" },
    { observation: "Blue solution", type: "base" },
    { observation: "Clear liquid", type: "water" },
    { observation: "Gray", type: "metal" },
    { observation: "Pale yellow", type: "salt" },
    { observation: "Marked with '?'", type: "unknown" },
  ],
  cases: [
    {
      title: "3 Beaker Case",
      rules: [
        {
          name: "Rule 1: Acid–Base–Water",
          steps: [
            "Mix Acid + Base first → Neutralization (safe).",
            "Add Water last → Stabilizes completely.",
            "⚠ If Water is mixed before neutralization → EXPLOSION.",
          ],
        },
        {
          name: "Rule 2: Acid–Metal–Water",
          steps: [
            "⚠ Never mix Metal + Acid first → Hydrogen gas = EXPLOSION.",
            "Mix Acid + Water first (dilution).",
            "Then add Metal slowly → Safe neutral reaction.",
          ],
        },
        {
          name: "Rule 3: Base–Metal–Salt",
          steps: [
            "Mix Base + Salt first → Slight neutralization, safe.",
            "⚠ If Metal added before Base → Risk of oxidation (unstable).",
            "Only add Metal last if both other liquids are already mixed.",
          ],
        },
        {
          name: "Rule 4: All Reactive (Acid, Base, Metal)",
          steps: [
            "Neutralize Acid + Base first.",
            "Do not add Metal afterward — isolate it if possible.",
            "If Metal must be mixed → Use Base + Metal (weak reaction, lower risk).",
          ],
        },
      ],
    },
    {
      title: "4 Beaker Case",
      rules: [
        {
          name: "Rule 1: Acid–Metal–Water–Salt",
          steps: [
            "⚠ Never mix Acid + Metal first → Immediate EXPLOSION.",
            "Dilute Acid by mixing with Water first.",
            "Add Salt next to control ionic balance.",
            "Introduce Metal last → Safe mild reaction if previous steps were stable.",
          ],
        },
        {
          name: "Rule 2: Two Acids, One Base, One Unknown ('?')",
          steps: [
            "Mix Base + weaker Acid first (weaker = lighter color).",
            "Test '?' by dipping a drop — if bubbles form, it's reactive; treat as Metal/discard.",
            "If no reaction → Add '?' last (acts as stabilizer).",
          ],
        },
        {
          name: "Rule 3: All Reactive (Acid, Base, Metal, Salt)",
          steps: [
            "Neutralize Acid + Base first.",
            "Add Salt next → Acts as a shield/stabilizer.",
            "Add Metal last only if previous reaction was stable.",
            "⚠ If any fizzing persists before final mix → STOP; instability risk.",
          ],
        },
      ],
    },
    {
      title: "5 Beaker Case",
      rules: [
        {
          name: "Rule 1: Full Set (Acid, Base, Metal, Salt, Water)",
          steps: [
            "Mix Acid + Base → Neutralization.",
            "Add Salt next → Ionic stabilization.",
            "Add Water for dilution.",
            "⚠ Metal must be added last — if fizzing occurs at any point, STOP immediately.",
          ],
        },
        {
          name: "Rule 2: Two Acids Present",
          steps: [
            "Identify stronger acid (darker color = stronger).",
            "Mix strong Acid + Base first → Neutral.",
            "Add weaker Acid next → Mild reaction, manageable.",
            "Introduce Salt and Water afterward for stabilization.",
          ],
        },
        {
          name: "Rule 3: Unknown ('?') Present",
          steps: [
            "Mix Acid + Base → Check for color change or smoke.",
            "Add Salt next if no smoke.",
            "Test '?' by adding one drop:",
            "  • If bubbles → Reactive (treat as Metal).",
            "  • If color fades → Neutral (treat as Water).",
            "Proceed accordingly based on the test.",
          ],
        },
        {
          name: "Rule 4: Multiple Metals or Reactive Pairings",
          steps: [
            "⚠ If more than one Metal → Do not mix Metals directly.",
            "Pre-mix Acid + Water to form diluted acid before adding metals.",
            "Add each Metal one by one while observing for fizzing.",
            "⚠ If continuous fizzing occurs → STOP and isolate last metal.",
          ],
        },
        {
          name: "Rule 5: No Water Present",
          steps: [
            "Create artificial dilution: Mix Acid + Salt first.",
            "Add Base next → Observe for mild heat.",
            "Introduce Metal only after reaction cools.",
            "⚠ If temperature rises again → ABORT.",
          ],
        },
      ],
    },
  ],
  notes: [
    "Always mix in the order specified — sequence matters!",
    "Watch for fizzing, bubbling, color changes, or smoke.",
    "Any unstable reaction = potential explosion; STOP immediately and isolate.",
  ],
},
    light: {
      title: "Light Merge",
      description:
        "Light Merge is a fast-paced physics puzzle where players use mirrors and lenses to merge light beams into a single target. Answer 4 constant-based quiz questions to form a 4-letter code, then pull the correct lever sequence.",
      quiz: [
        {
          question: "Which constant represents the speed of light?",
          answer: "Speed of Light",
          letter: "c",
        },
        {
          question:
            "Which constant determines gravitational force between two masses?",
          answer: "Gravitational Constant",
          letter: "G",
        },
        {
          question:
            "Which constant relates energy of a photon to its frequency?",
          answer: "Planck's Constant",
          letter: "h",
        },
        {
          question:
            "Which constant is used to find wavenumber in hydrogen spectrum?",
          answer: "Rydberg Constant",
          letter: "R",
        },
        {
          question: "Which constant measures electric charge of one electron?",
          answer: "Elementary Charge",
          letter: "e",
        },
        {
          question:
            "Which constant represents Boltzmann's relation between energy and temperature?",
          answer: "Boltzmann Constant",
          letter: "k",
        },
      ],
      cases: [
        {
          title: "Expert Code Case Table",
          subtitle:
            "After Defuser gives 4-letter code, determine correct lever sequence",
          rules: [
            {
              name: "Energy Case",
              code: "c h R k",
              pulleys: { three: "010", four: "0110" },
            },
            {
              name: "Gravitational Case",
              code: "G m h R",
              pulleys: { three: "100", four: "0101" },
            },
            {
              name: "Thermodynamic Case",
              code: "R k B T",
              pulleys: { three: "110", four: "1001" },
            },
            {
              name: "Electromagnetic Case",
              code: "c e h R",
              pulleys: { three: "101", four: "1010" },
            },
            {
              name: "Mixed Case",
              code: "Any other combo",
              pulleys: { three: "001", four: "0011" },
            },
            {
              name: "⚠ Warning Case",
              code: "Repeated letters (e.g., c c h h)",
              pulleys: { three: "011", four: "0111" },
            },
          ],
        },
      ],
      notes: [
        "Defuser merges beams first, then answers 4 quiz questions",
        "Each correct answer gives one letter of the code",
        "Expert uses code to determine exact lever sequence",
        "Any mistake in lever sequence may trigger bomb!",
      ],
    },
    circuit: {
      title: "Circuit Solver (Sample Module)",
      description:
        "A sample module demonstrating circuit analysis. The Defuser sees a circuit diagram with resistors, capacitors, and power sources. Expert must guide them to calculate correct values and connect components.",
      cases: [
        {
          title: "Series Circuit Case",
          rules: [
            {
              name: "Rule 1: Pure Resistor Circuit",
              steps: [
                "Calculate total resistance: R_total = R1 + R2 + R3 + ...",
                "Use Ohm's Law: V = I × R",
                "Instruct Defuser to set output voltage accordingly",
                "Verify current readings match calculations",
              ],
            },
            {
              name: "Rule 2: RC Circuit (Resistor-Capacitor)",
              steps: [
                "Calculate time constant: τ = R × C",
                "Charging formula: V(t) = V₀(1 - e^(-t/τ))",
                "Discharging formula: V(t) = V₀ × e^(-t/τ)",
                "Guide Defuser through time-based readings",
              ],
            },
          ],
        },
        {
          title: "Parallel Circuit Case",
          rules: [
            {
              name: "Rule 1: Pure Resistor Parallel",
              steps: [
                "Calculate total resistance: 1/R_total = 1/R1 + 1/R2 + 1/R3",
                "Current divides based on resistance values",
                "Lower resistance = Higher current through that branch",
                "Sum of branch currents = Total current",
              ],
            },
            {
              name: "Rule 2: Mixed Components",
              steps: [
                "Identify series and parallel sections separately",
                "Simplify parallel sections first",
                "Then treat as series circuit",
                "Calculate voltages and currents step by step",
              ],
            },
          ],
        },
        {
          title: "Complex Circuit Case",
          rules: [
            {
              name: "Rule 1: Kirchhoff's Laws",
              steps: [
                "Current Law (KCL): Sum of currents entering = Sum leaving",
                "Voltage Law (KVL): Sum of voltages in closed loop = 0",
                "Set up simultaneous equations",
                "Solve for unknown values",
              ],
            },
            {
              name: "Rule 2: Thevenin Equivalent",
              steps: [
                "Remove load resistor",
                "Calculate open circuit voltage (V_th)",
                "Calculate equivalent resistance (R_th)",
                "Reconnect load and find final current",
              ],
            },
          ],
        },
      ],
      notes: [
        "Always verify units (Volts, Amps, Ohms)",
        "Double-check polarity of voltage sources",
        "Watch for short circuits (can trigger bomb!)",
        "Time-based calculations require stopwatch coordination",
      ],
    },
  };

  const colorClasses = {
    red: {
      border: "border-red-500/50",
      hoverBorder: "hover:border-red-400",
      bg: "bg-red-500/20",
      text: "text-red-400",
      glow: "shadow-red-500/50",
      activeBg: "bg-red-500/30",
    },
    cyan: {
      border: "border-cyan-500/50",
      hoverBorder: "hover:border-cyan-400",
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/50",
      activeBg: "bg-cyan-500/30",
    },
    yellow: {
      border: "border-yellow-500/50",
      hoverBorder: "hover:border-yellow-400",
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      glow: "shadow-yellow-500/50",
      activeBg: "bg-yellow-500/30",
    },
    green: {
      border: "border-green-500/50",
      hoverBorder: "hover:border-green-400",
      bg: "bg-green-500/20",
      text: "text-green-400",
      glow: "shadow-green-500/50",
      activeBg: "bg-green-500/30",
    },
  };

  const activeModuleData = modules.find((m) => m.id === activeModule);
  const content = moduleContent[activeModule];
  const colors = colorClasses[activeModuleData.color];

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-black pointer-events-none" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="h-full w-full"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 2px, transparent 4px)",
            animation: "scanline 8s linear infinite",
          }}
        />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-5 left-5 w-20 h-20 border-l-2 border-t-2 border-cyan-500 opacity-60" />
      <div className="absolute top-5 right-5 w-20 h-20 border-r-2 border-t-2 border-cyan-500 opacity-60" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/60 border-b-2 border-cyan-500/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Book className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1
                    className={`text-3xl font-black transition-all duration-100 ${
                      glitch ? "text-cyan-500 scale-105" : "text-cyan-400"
                    }`}
                    style={{
                      textShadow: glitch
                        ? "2px 2px 0px #00ffff, -2px -2px 0px #ff00ff"
                        : "2px 2px 0px #0891b2, 4px 4px 15px rgba(34, 211, 238, 0.5)",
                    }}
                  >
                    EXPERT MANUAL
                  </h1>
                  <p className="text-gray-400 text-sm tracking-wider">
                    BOMB DEFUSAL PROTOCOLS - EVERY TICK COUNTS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-full">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-cyan-400 font-bold text-sm tracking-wider">
                  EXPERT MODE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="bg-black/40 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {modules.map((module) => {
                const moduleColors = colorClasses[module.color];
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`flex items-center gap-3 px-6 py-4 border-b-4 transition-all whitespace-nowrap ${
                      isActive
                        ? `${moduleColors.border.replace("/50", "")} ${
                            moduleColors.text
                          } ${moduleColors.activeBg}`
                        : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-900/20"
                    }`}
                  >
                    {module.icon}
                    <span className="font-bold tracking-wider">
                      {module.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Module header */}
          <div
            className={`mb-8 bg-black/60 border-2 ${colors.border} rounded-lg p-6 backdrop-blur-sm`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-4 ${colors.bg} rounded-lg border ${colors.border}`}
              >
                {activeModuleData.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white mb-2">
                  {content.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {content.description}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Clues for Chemical Chaos */}
          {activeModule === "chemical" && content.visualClues && (
            <div className="mb-8 bg-black/60 border-2 border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-black text-cyan-400 mb-4 flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                Visual Descriptive Clues for Beakers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.visualClues.map((clue, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="text-gray-400 text-sm mb-1">
                      {clue.observation}
                    </div>
                    <div className="text-cyan-400 font-bold">{clue.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz for Light Merge */}
          {activeModule === "light" && content.quiz && (
            <div className="mb-8 bg-black/60 border-2 border-yellow-500/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-black text-yellow-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Defuser – Quiz of Constants
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                When beams merge, answer the 4 questions below. Each correct
                answer gives one letter.
              </p>
              <div className="space-y-3">
                {content.quiz.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="text-gray-300 mb-1">{q.question}</div>
                      <div className="text-sm text-gray-500">{q.answer}</div>
                    </div>
                    <div className="text-3xl font-black text-yellow-400 ml-4">
                      {q.letter}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules sections */}
          {content.cases.map((caseData, caseIdx) => (
            <div key={caseIdx} className="mb-8">
              <h3
                className={`text-2xl font-black ${colors.text} mb-4 pb-2 border-b-2 ${colors.border}`}
              >
                {caseData.title}
              </h3>
              {caseData.subtitle && (
                <p className="text-gray-400 mb-4">{caseData.subtitle}</p>
              )}

              <div className="space-y-4">
                {caseData.rules.map((rule, ruleIdx) => (
                  <div
                    key={ruleIdx}
                    className="bg-black/60 border-2 border-gray-800 rounded-lg p-6 backdrop-blur-sm hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Zap
                        className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-1`}
                      />
                      <div className="flex-1">
                        <h4
                          className={`text-lg font-black ${colors.text} mb-2`}
                        >
                          {rule.name || `${caseData.title} - ${ruleIdx + 1}`}
                        </h4>
                        {rule.condition && (
                          <p className="text-gray-400 text-sm mb-3 italic">
                            {rule.condition}
                          </p>
                        )}
                        {rule.code && (
                          <div className="mb-3 flex items-center gap-4">
                            <span className="text-gray-500 text-sm">Code:</span>
                            <span className="text-cyan-400 font-bold text-lg">
                              {rule.code}
                            </span>
                          </div>
                        )}
                        {rule.pulleys && (
                          <div className="mb-3 grid grid-cols-2 gap-4">
                            <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                              <div className="text-gray-500 text-xs mb-1">
                                3 Pulley
                              </div>
                              <div className="text-green-400 font-bold font-mono">
                                {rule.pulleys.three}
                              </div>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-800 rounded p-3">
                              <div className="text-gray-500 text-xs mb-1">
                                4 Pulley
                              </div>
                              <div className="text-green-400 font-bold font-mono">
                                {rule.pulleys.four}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {rule.steps && (
                      <div className="space-y-2 ml-8">
                        {rule.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="flex items-start gap-3">
                            <span
                              className={`${colors.text} font-bold mt-1 flex-shrink-0`}
                            >
                              ▸
                            </span>
                            <span className="text-gray-300 leading-relaxed">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Important notes */}
          <div className="mt-8 bg-red-950/40 border-2 border-red-500/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <h3 className="text-xl font-black text-red-400">
                IMPORTANT NOTES
              </h3>
            </div>
            <div className="space-y-2">
              {content.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="text-red-400 font-bold mt-1">⚠</span>
                  <span className="leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download PDF Section */}
          <div className="mt-8 bg-black/60 border-2 border-gray-800 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-gray-400" />
                <h3 className="text-xl font-black text-gray-400">
                  DOWNLOAD FULL MANUAL
                </h3>
              </div>
              <a
                href="/manuals/expert-manual.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 border-2 border-cyan-400 rounded-lg font-bold tracking-wider transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                PDF
              </a>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-2">
                Place your complete manual PDF at:{" "}
                <code className="text-cyan-400">
                  /public/manuals/expert-manual.pdf
                </code>
              </p>
              <p className="text-gray-600 text-sm">
                To embed PDF inline, use:{" "}
                <code className="text-cyan-400">
                  &lt;iframe src="/manuals/expert-manual.pdf" /&gt;
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
