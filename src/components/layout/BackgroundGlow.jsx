// Decorative background glow layer
export default function BackgroundGlow() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-120px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"/>
            <div className="absolute right-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-3xl"/>
            <div className="absolute bottom-[-120px] left-[-80px] h-[280px] w-[280px] rounded-full bg-fuchsia-500/20 blur-3xl"/>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]"/>
        </div>
    );
}