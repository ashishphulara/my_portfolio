"use client";

import { DUMMY_PROJECTS } from "@/app/data/Projects";
import { useState, useEffect } from "react";

export function useProjects(featured?: boolean, limit?: number) {
  const [projects, setProjects] = useState([]);
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
