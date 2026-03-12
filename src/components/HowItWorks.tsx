import { MessageSquare, Bot, Package } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <MessageSquare className="w-10 h-10 text-orange" />,
      title: "Describe Your Problem",
      description: "Type or speak what's bothering you",
    },
    {
      icon: <Bot className="w-10 h-10 text-orange" />,
      title: "AI Finds Solutions",
      description: "AI curates the perfect product bundle",
    },
    {
      icon: <Package className="w-10 h-10 text-orange" />,
      title: "Buy & Solve",
      description: "Get everything delivered to your door",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora text-3xl md:text-4xl font-bold text-navy mb-4">
            How SolveKart Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to go from problem to solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm hover:shadow-md transition-shadow relative z-10"
            >
              <div className="w-20 h-20 rounded-full bg-orange/10 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="font-sora text-xl font-semibold text-navy mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-[90px] left-[16%] right-[16%] border-t-2 border-dashed border-slate-200 z-0" />
        </div>
      </div>
    </section>
  );
}
