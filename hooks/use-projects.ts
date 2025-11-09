"use client";

import { useState, useEffect } from "react";

export type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  tech: string[];
  featured?: boolean;
};

const DUMMY_PROJECTS: Project[] = [
  {
    _id: "1",
    title: "E-Commerce Store",
    description:
      "A complete MERN e-commerce application with authentication, cart, orders, and payments.",
    image: "https://images.unsplash.com/photo-1560963689-14f6c01f1c88?w=900",
    githubUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://example.com/ecommerce",
    tech: ["React", "Node", "MongoDB", "Stripe"],
    featured: true,
  },
  {
    _id: "2",
    title: "DevOps CI/CD Pipeline",
    description:
      "Automated CI/CD pipeline using Docker, GitHub Actions, Kubernetes & AWS.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900",
    githubUrl: "https://github.com/example/devops-pipeline",
    liveUrl: "https://example.com/devops",
    tech: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
    featured: true,
  },
  {
    _id: "3",
    title: "Chat App",
    description:
      "Real-time chat app using Socket.io with online status, typing indicators and rooms.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
    githubUrl: "https://github.com/example/chatapp",
    liveUrl: "https://example.com/chat",
    tech: ["Node", "Socket.io", "React"],
    featured: true,
  },
  {
    _id: "4",
    title: "Portfolio Website",
    description:
      "Personal portfolio built with Next.js, 3D animations, and smooth scroll.",
    image: "https://images.unsplash.com/photo-1559127450-1f4d3c2b580e?w=900",
    githubUrl: "https://github.com/example/portfolio",
    liveUrl: "https://example.com/portfolio",
    tech: ["Next.js", "Three.js", "Tailwind"],
    featured: false,
  },
  {
    _id: "5",
    title: "Fitness Mobile App",
    description:
      "React Native fitness tracker with charts, BMI analysis, and workouts.",
    image: "https://images.unsplash.com/photo-1596357395217-80de13130d93?w=900",
    githubUrl: "https://github.com/example/fitnessapp",
    liveUrl: "https://example.com/fitness",
    tech: ["React Native", "Redux", "Firebase"],
    featured: false,
  },
  {
    _id: "6",
    title: "Blog Platform",
    description:
      "Full blogging platform with comments, tags, editor & admin dashboard.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    githubUrl: "https://github.com/example/blog",
    liveUrl: "https://example.com/blog",
    tech: ["Next.js", "PostgreSQL", "Prisma"],
    featured: true,
  },
];

export function useProjects(featured?: boolean, limit?: number) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    // simulate API delay
    await new Promise((res) => setTimeout(res, 400));

    let filtered = DUMMY_PROJECTS;

    if (featured) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setProjects(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [featured, limit]);

  return { projects, loading, error: null, refetch: fetchProjects };
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 300));

      const found = DUMMY_PROJECTS.find((p) => p._id === id) || null;

      setProject(found);
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  return { project, loading, error: null };
}
