"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
  scrollY?: number;
}

export function ProjectCard({
  project,
  index = 0,
  scrollY = 0,
}: ProjectCardProps) {
  return (
    <Card
      className="
        group relative overflow-hidden
        rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-md
        hover:shadow-[0_0_25px_rgba(0,255,200,0.2)]
        transition-all duration-500
        hover:-translate-y-2
        h-full flex flex-col
      "
      style={{
        transform: `translateY(${scrollY * 0.03 * (index + 1)}px)`,
      }}
    >
      {/* ✅ Project Image */}
      {project.image && (
        <div className="relative w-full h-40 overflow-hidden rounded-t-2xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
          {project.featured && (
            <Badge className="absolute top-2 right-2 bg-primary text-white text-xs shadow">
              Featured
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="flex-grow p-5">
        <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {/* ✅ Tech Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech?.map((t) => (
            <Badge
              key={t}
              className="text-xs bg-primary/10 border border-primary/20"
            >
              {t}
            </Badge>
          ))}
        </div>

        {/* ✅ Buttons */}
        <div className="flex gap-2">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-1" /> Code
              </a>
            </Button>
          )}

          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-1" /> Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
