---
name: Lokalisierung im Museum
date: 2018-03-18
end: 2018-06-03
links:
  - name: GitHub
    link: https://github.com/CordlessWool/time_sync_master_slave
languages:
  - C
  - Python
tools:
  - Raspberry PI
typewriter:
  remove-letters: 580
tags: project
---

Während meinem Master Studium haben zwei Kommilitonen und ich ein Projekt im Rahmen einer Vorlesung verfolgt, dass sich um die Lokalisierung durch Triangulation beschäftigte. Als Fiktiven schauplatz haben wir uns ein Museum herausgesucht. Das Ziel war eine Lokalisierung im Raum zu erreichen. Als einfachste Identifikator, erschien uns Geräusche zu verwenden. Zunächst war aber das Problem zu lösen alle Ton Quellen zu Synchronisieren. Die erste Version wurde von uns in Python entwickelt stellte sich aber als viel zu ungenau heraus. Also Implementierten wir eine Version in C die so Konfiguriert wurde, dass Sie in Echtzeit Operieren konnte und nicht durch andere Prozesse gestört wurde. Außerdem konnten sich die Clients selbst Synchronisieren. Leider ist uns die Lokalisierung dennoch nicht wie gewünscht gelungen.
