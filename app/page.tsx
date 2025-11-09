"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Github,
  Linkedin,
  Code,
  Database,
  Server,
  Smartphone,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/project-card";
import { ContactForm } from "@/components/contact-form";
import { ThreeDScene } from "@/components/3d-scene";
import { useRouter } from "next/navigation";

function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
}

export default function Home() {
  const scrollY = useParallax();
  const [heroRef, heroInView] = useInView(0.3);
  const [aboutRef, aboutInView] = useInView(0.3);
  const [skillsRef, skillsInView] = useInView(0.3);
  const [projectsRef, projectsInView] = useInView(0.2);
  const router = useRouter();

  const {
    projects: featuredProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects(true, 6);

  const skills = [
    {
      name: "React/Next.js",
      level: 95,
      icon: <Code className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "React Native",
      level: 90,
      icon: <Code className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Node.js/Express",
      level: 90,
      icon: <Server className="w-6 h-6" />,
      color: "from-emerald-600 to-green-500",
    },
    {
      name: "MongoDB/SQL",
      level: 85,
      icon: <Database className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
    },
    {
      name: "DevOps/AWS",
      level: 80,
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Docker",
      level: 75,
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-green-500 to-emerald-700",
    },
    {
      name: "Kubernetes",
      level: 70,
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-green-500 to-emerald-800",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ✅ HERO SECTION ---------------------------- */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60 animate-gradient-shift"
          style={{
            background: `linear-gradient(135deg, 
              oklch(0.45 0.15 160 / 0.1), 
              oklch(0.55 0.12 160 / 0.05), 
              oklch(0.65 0.15 160 / 0.08),
              oklch(0.45 0.15 160 / 0.1))`,
            backgroundSize: "400% 400%",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-float animate-morph"
            style={{
              background:
                "radial-gradient(circle, oklch(0.45 0.15 160 / 0.4), transparent 70%)",
              transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
            }}
          />

          <div
            className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full opacity-15 animate-float animate-morph"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.12 160 / 0.5), transparent 70%)",
              transform: `translate(${-scrollY * 0.08}px, ${
                -scrollY * 0.06
              }px)`,
              animationDelay: "2s",
            }}
          />
        </div>

        {/* 3D Scene */}
        <div className="absolute inset-0 z-10">
          <ThreeDScene className="w-full h-full" />
        </div>

        <div
          className={`relative z-20 text-center max-w-5xl mx-auto px-6 transition-all duration-1000 ${
            heroInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-bold mb-6 text-balance leading-none">
              <span className="gradient-text animate-gradient-shift">
                Full Stack
              </span>
              <span className="inline-block text-center text-primary animate-pulse-glow px-10 py-2 border border-primary/40 rounded-full min-w-[200px]">
                Developer
              </span>
            </h1>

            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-accent animate-spin" />
              <p className="text-xl md:text-3xl text-muted-foreground text-pretty">
                3 years of crafting digital experiences with modern web
                technologies
              </p>
              <Sparkles
                className="w-6 h-6 text-accent animate-spin"
                style={{ animationDirection: "reverse" }}
              />
            </div>
          </div>

          <div className="flex gap-6 justify-center flex-wrap mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-4 animate-pulse-glow transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View My Work
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 transform hover:scale-105 transition-all duration-300 bg-transparent"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
            </Button>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="w-8 h-8 text-primary mx-auto" />
          </div>
        </div>
      </section>

      {/* ✅ ABOUT SECTION ---------------------------- */}
      <section ref={aboutRef} className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 20% 80%, oklch(0.45 0.15 160 / 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, oklch(0.55 0.12 160 / 0.2) 0%, transparent 50%)`,
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />

        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${
            aboutInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-8 gradient-text">
                About Me
              </h2>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                I'm a passionate full-stack developer with 3 years of experience
                building scalable web applications and 1 year of DevOps
                expertise.
              </p>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                I've worked with{" "}
                <span className="font-semibold">
                  React, Next.js, Node.js, Docker, Kubernetes, AWS
                </span>{" "}
                and automated CI/CD pipelines.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold animate-pulse">
                  Next.js
                </span>
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold animate-pulse">
                  Docker
                </span>
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold animate-pulse">
                  Kubernetes
                </span>
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold animate-pulse">
                  CI/CD
                </span>
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold animate-pulse">
                  AWS
                </span>
              </div>

              <div className="flex gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="group hover:bg-primary/10 border-primary/50 bg-transparent"
                  onClick={() =>
                    window.open("https://github.com/ashishphulara", "_blank")
                  }
                >
                  <Github className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  GitHub
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="group hover:bg-primary/10 border-primary/50 bg-transparent"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/ashish-phulara",
                      "_blank",
                    )
                  }
                >
                  <Linkedin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 rounded-3xl overflow-hidden animate-morph">
                <div
                  className="absolute inset-0 animate-gradient-shift"
                  style={{
                    background: `linear-gradient(135deg, 
                oklch(0.45 0.15 160 / 0.3), 
                oklch(0.55 0.12 160 / 0.2), 
                oklch(0.65 0.15 160 / 0.3))`,
                    backgroundSize: "400% 400%",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-float">👨‍💻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SKILLS SECTION (FULLY UPGRADED CARDS) ---------------------------- */}
      <section ref={skillsRef} className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(45deg, oklch(0.45 0.15 160 / 0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, oklch(0.55 0.12 160 / 0.1) 25%, transparent 25%)`,
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-5xl font-bold text-center text-foreground mb-16 gradient-text transition-all duration-1000 ${
              skillsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            Skills & Expertise
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills?.map((skill, index) => (
              <Card
                key={skill.name}
                className={`
    relative text-center py-6 px-4
    bg-white/5 backdrop-blur-xl 
    border border-white/10 
    rounded-3xl shadow-md
    hover:shadow-[0_0_25px_rgba(0,255,200,0.25)]
    transition-all duration-400 
    hover:-translate-y-2 hover:scale-105
    hover:border-primary/40
    group
    ${skillsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
  `}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* glowing border */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.15 160 / .6), transparent 60%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    padding: "2px",
                  }}
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full 
        bg-gradient-to-br from-primary/20 to-primary/5 
        group-hover:from-primary/40 group-hover:to-primary/10
        shadow-inner transition-all duration-400"
                  >
                    <div className="text-primary group-hover:rotate-12 transition-transform duration-300">
                      {skill.icon}
                    </div>
                  </div>

                  {/* Skill Name */}
                  <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </p>

                  {/* Progress Bar */}
                  <div className="relative w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${skill.color} animate-gradient-shift`}
                      style={{
                        width: skillsInView ? `${skill.level}%` : "0%",
                        backgroundSize: "250% 250%",
                        transition: "width 1.2s ease-out",
                      }}
                    />
                  </div>

                  <span className="text-sm font-medium text-primary">
                    {skill.level}%
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ PROJECTS SECTION ---------------------------- */}
      <section
        ref={projectsRef}
        id="projects"
        className="py-32 px-6 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, oklch(0.45 0.15 160 / 0.2), oklch(0.55 0.12 160 / 0.1), oklch(0.45 0.15 160 / 0.2))`,
            transform: `translateY(${scrollY * 0.08}px) rotate(${
              scrollY * 0.02
            }deg)`,
          }}
        />

        <div className="max-w-6xl mx-auto">
          <h2
            className={`text-5xl font-bold text-center text-foreground mb-16 gradient-text transition-all duration-1000 ${
              projectsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            Featured Projects
          </h2>

          {/* Loading */}
          {projectsLoading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <span className="ml-4 text-xl text-muted-foreground">
                Loading amazing projects...
              </span>
            </div>
          )}

          {/* Error */}
          {projectsError && (
            <div className="text-center py-16">
              <p className="text-destructive mb-6 text-xl">
                Failed to load projects: {projectsError}
              </p>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="hover:bg-primary/10"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Projects list */}
          {!projectsLoading && !projectsError && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredProjects.length > 0 ? (
                  featuredProjects?.slice(0, 3).map((project, index) => (
                    <div
                      key={project._id}
                      className={`transition-all duration-1000 ${
                        projectsInView
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-20"
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                        scrollY={scrollY}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground text-xl">
                      No featured projects available yet.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      {/* ✅ View More Button */}
      <div className="text-center mt-12 mb-12">
        <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 animate-pulse-glow px-8 py-4"
          onClick={() => router.push("/projects")}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          View More Projects
        </Button>
      </div>

      {/* ✅ CONTACT SECTION ---------------------------- */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `linear-gradient(135deg, 
              oklch(0.45 0.15 160 / 0.05), 
              oklch(0.55 0.12 160 / 0.03), 
              oklch(0.65 0.15 160 / 0.05))`,
            backgroundSize: "400% 400%",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-foreground mb-8 gradient-text">
            Let's Work Together
          </h2>

          <p className="text-2xl text-muted-foreground mb-16 text-pretty">
            Ready to bring your ideas to life? Let's discuss your next project.
          </p>

          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-primary/20 animate-pulse-glow">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ✅ FOOTER ---------------------------- */}
      <footer className="py-12 px-6 border-t border-border relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, oklch(0.45 0.15 160 / 0.1), transparent)`,
          }}
        />

        <div className="max-w-6xl mx-auto text-center text-muted-foreground relative z-10">
          <p className="text-lg">
            &copy; 2024 Full Stack Developer. Built with Next.js, Three.js, and
            lots of ☕
          </p>
        </div>
      </footer>
    </div>
  );
}
