import { AnnotatedText } from "@/components/text/AnnotatedText";
import { ScrollWordReveal } from "@/components/text/ScrollWordReveal";
import { ClipReveal } from "@/components/ClipReveal";

export function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-4 py-[18vh] md:px-10">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 mb-10 md:col-span-3">
          <ClipReveal from="right" amount={1}>
            <p className="eyebrow text-muted">(01) — Manifesto</p>
          </ClipReveal>
        </div>
        <div className="col-span-12 md:col-span-9">
          <ScrollWordReveal
            className="text-[clamp(30px,4.4vw,68px)] font-light leading-[1.08] tracking-[-0.02em]"
            text="Cada corpo conta uma *história.* Antes de tratar a dor, eu escuto. Uno fisioterapia, acupuntura e estética num cuidado que vai até a *causa* e devolve ao seu corpo o que é dele: *leveza.*"
            decorate={{
              "história": (w) => (
                <AnnotatedText variant="circle" color="text-clay" delay={0.2} duration={0.9}>
                  {w}
                </AnnotatedText>
              ),
              causa: (w) => (
                <AnnotatedText variant="underline" color="text-clay" delay={0.2}>
                  {w}
                </AnnotatedText>
              ),
              leveza: (w) => (
                <AnnotatedText variant="highlight" color="text-blush" delay={0.3}>
                  {w}
                </AnnotatedText>
              ),
            }}
          />
        </div>
      </div>
    </section>
  );
}
