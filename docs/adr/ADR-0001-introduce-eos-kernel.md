# ADR-0001: Introduce the EOS Kernel

## Status

Accepted

## Date

2026-07-04

## Context

EOS is evolving from an application into an AI-native enterprise operating system. Its foundational logic, principles, governance, value frameworks, ontology, authority model, and autonomous evolution rules should not be treated as ordinary documentation or application content.

These foundational components must exist as a first-class infrastructure layer that governs all other EOS modules, agents, workflows, Digital Twin Assets, and autonomous actions.

## Decision

Create a top-level `kernel/` directory as the governing foundation of EOS.

The EOS Kernel will contain the core genome, constitution, ontology, authority framework, ethics framework, value framework, evolution rules, and build system instructions that every EOS component must inherit or obey.

## Consequences

- EOS gains a clear foundational layer.
- Future AI coding agents must treat the Kernel as required context.
- The existing Genome foundation will be moved from `knowledge/genome/` into `kernel/genome/`.
- Kernel documents will be treated as higher-authority than ordinary documentation.
- Application modules, services, agents, and Digital Twin Assets must align with Kernel principles.

## Initial Kernel Structure

kernel/
  genome/
  constitution/
  ontology/
  authority/
  ethics/
  value/
  evolution/
  build/

