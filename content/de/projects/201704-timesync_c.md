---
title: Lokalisierung im Museum
date: 2017-04-01
end: 2017-06-03
links:
  - name: GitHub
    link: https://github.com/CordlessWool/time_sync_master_slave
languages:
  - C
  - Python
tools:
  - Raspberry PI
type: study
tags: project
---

Im Rahmen einer Vorlesung während meines Master-Studiums haben zwei Kommilitonen und ich ein Projekt zur Lokalisierung durch Triangulation verfolgt. Als fiktiven Schauplatz haben wir uns ein Museum herausgesucht. Das Ziel war, eine Lokalisierung im Raum zu erreichen. Als einfachste Identifikatoren erschienen uns Geräusche. Zunächst war aber das Problem zu lösen, alle Tonquellen zu synchronisieren. Die erste Version wurde von uns in Python entwickelt, stellte sich aber als viel zu ungenau heraus. Daraufhin haben wir eine Version in C implementiert, die so konfiguriert wurde, dass sie in Echtzeit operieren konnte und nicht durch andere Prozesse gestört wurde. Außerdem konnten sich die Clients selbst synchronisieren. Leider ist uns die Lokalisierung dennoch nicht wie gewünscht gelungen.
