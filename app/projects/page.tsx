"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DUMMY_PROJECTS } from "../data/Projects";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen py-28 px-6 flex items-center justify-center overflow-hidden">
      {/* ✅ Animated Three.js Background */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 8] }} className="w-full h-full">
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} />

          {/* Floating 3D spheres */}
          {[...Array(6)].map((_, i) => (
            <mesh
              position={[
                Math.random() * 6 - 3,
                Math.random() * 6 - 3,
                Math.random() * -4,
              ]}
            >
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial
                color={"#00f0a8"}
                opacity={0.3}
                transparent
              />
            </mesh>
          ))}

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center gradient-text mb-14"
        >
          All Projects
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DUMMY_PROJECTS.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* ✅ New Card Design */}
              <Card
                className="
                  rounded-xl overflow-hidden
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  hover:shadow-[0_0_30px_rgba(0,255,200,0.25)]
                  transition-all duration-500 hover:-translate-y-2
                "
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {project.featured && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-xs border border-primary/30 rounded-full bg-primary/10 text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1"
                      >
                        <Link href={project.githubUrl} target="_blank">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </Link>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1"
                      >
                        <Link href={project.liveUrl} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Live
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary animate-pulse-glow px-10 py-5"
            asChild
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
