import React from 'react'
import { AnimatedProjectViewer } from './AnimatedProjectViewer'
import type { ProjectItem } from '../types'

interface ProjectsShowcaseProps {
  projects: ProjectItem[]
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  return <AnimatedProjectViewer projects={projects} />
}

export { AnimatedProjectViewer }
