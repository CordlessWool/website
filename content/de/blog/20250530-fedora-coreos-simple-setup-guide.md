---
title: "Fedora CoreOS Setup Guide – Ignition-File ohne Frustration"
topic: "Container"
description: Step-by-Step Anleitung für Fedora CoreOS Installation mit Ignition-File. Python HTTP-Server, Butane Konvertierung und praktische Tipps ohne Umwege.
hero:
  image: $assets/fedora-coreos-logo.png
  alt: Fedora CoreOS
  photographer: "@Fedora Project"
  photographer_link: https://fedoraproject.org/
meta:
  keywords:
    - fedora coreos
    - coreos
    - ignition file
    - butane
    - rpm-ostree
    - container linux
    - immutable os
    - docker-compose
    - linux installation
    - python http server
    - coreos-installer
published: 2025-05-30
updatedAt: 2025-08-08
layout: $layout/BlogPost.svelte
category: dev
tags:
  - Linux
  - CoreOS
  - Container
  - DevOps
  - Installation Guide
  - blog
---

# Fedora CoreOS Setup Guide – Ignition-File ohne Frustration

Fedora CoreOS Setup scheitert meist nicht an der Komplexität, sondern am fehlenden Einstieg. Die Dokumentation ist umfassend - perfekt als Nachschlagewerk, aber nicht ideal für das erste Setup. Wer CoreOS nur gelegentlich installiert, steht oft vor der Frage: Wie kommt das Ignition-File überhaupt ins System? Genau das erklärt dieser Guide.

Der Artikel zeigt den Aufbau eines funktionierenden Fedora CoreOS Systems von Grund auf. Das Ignition-File wird Schritt für Schritt erstellt – mit SSH-Zugang und allem was für den Start nötig ist. Die Struktur ist relativ einfach und leicht verständlich, mit nur einem SSH public key für den `core` user.

CoreOS funktioniert anders als traditionelle Linux-Installationen – alles wird vorab definiert, statt nachträglich konfiguriert. Einmal verstanden ist der Ansatz überzeugend.

---

**TL;DR - Schnellreferenz:**

1. **Ignition-File erstellen:** YAML-Datei mit SSH-Key schreiben (`config.bu`)
2. **Zu JSON konvertieren:** `docker run --rm -i quay.io/coreos/butane:release --strict < config.bu > config.ign`
3. **HTTP-Server starten:** `python3 -m http.server 8000` im Verzeichnis mit der .ign Datei
4. **IP-Adresse finden:** `ip addr show | grep "inet " | grep -v 127.0.0.1` (Linux)
5. **CoreOS ISO booten** und installieren: `sudo coreos-installer install /dev/sda --ignition-url http://IP:8000/config.ign --insecure-ignition`
6. **Neustart** - CoreOS ist fertig konfiguriert

---

## Das Ignition-File erstellen

Das Ignition-File ist eine JSON-Datei, die das komplette System beschreibt bevor es installiert wird. Statt nach der Installation Benutzer anzulegen und SSH-Keys zu konfigurieren, passiert alles während des ersten Boots automatisch.

Der einfachste Weg ist, eine menschenlesbare YAML-Datei zu schreiben und diese dann mit Butane zu JSON zu konvertieren. Für den Einstieg reicht ein minimales Setup mit SSH-Zugang für den Standard-User:

```yaml
# config.bu
variant: fcos
version: 1.6.0
passwd:
  users:
    - name: core
      ssh_authorized_keys:
        - "ssh-rsa AAAAB3NzaC1yc2EAAAA... dein-public-key"
systemd:
  units:
    - name: docker.service
      enabled: true
```

Diese Konfiguration definiert SSH-Zugang für den Standard-User `core` und sorgt dafür, dass Docker automatisch beim Boot startet. Der `variant: fcos` gibt an, dass es sich um Fedora CoreOS handelt, die Version bestimmt das Schema. CoreOS kommt mit dem User `core` bereits vorkonfiguriert – er braucht nur noch einen SSH-Key.

**Warum Docker aktivieren?** Docker ist verfügbar und der `docker` Befehl funktioniert auch, aber Container laufen nicht richtig bis der Service permanent aktiviert ist. Ohne den `systemd`-Abschnitt müsstest Du nach jedem Neustart Docker wieder anstupsen. Da Du CoreOS wahrscheinlich eh für Container verwendest, ist es praktischer das gleich mitzumachen.

Alternativ kannst Du Docker auch nachträglich aktivieren:

```bash
# Docker nachträglich permanent aktivieren
sudo systemctl enable --now docker
```

Diese YAML-Datei (mit `.bu` Endung) wird dann mit Butane zu einer `.ign` JSON-Datei konvertiert, die CoreOS versteht.

### Von YAML zu JSON – Die Butane Konvertierung

Das YAML-File ist für Menschen lesbar, aber CoreOS versteht nur JSON. Dafür gibt es Butane – ein Tool, das die Konvertierung übernimmt und dabei auch die Syntax prüft.

Butane läuft am einfachsten als Container. Mit Docker oder Podman:

```bash
docker run --rm -i quay.io/coreos/butane:release --strict < config.bu > config.ign
```

Alternativ kann Butane auch als lokale Binary installiert werden, falls Docker nicht verfügbar ist.

Der `--strict` Parameter sorgt dafür, dass Butane bei Fehlern abbricht statt Warnungen zu ignorieren.

Das Ergebnis ist eine `config.ign` Datei mit dem JSON-Format, das Ignition versteht:

```json
{
  "ignition": {
    "version": "3.5.0"
  },
  "passwd": {
    "users": [
      {
        "name": "core",
        "sshAuthorizedKeys": ["ssh-rsa AAAAB3NzaC1yc2EAAAA... dein-public-key"]
      }
    ]
  },
  "systemd": {
    "units": [
      {
        "enabled": true,
        "name": "docker.service"
      }
    ]
  }
}
```

Diese `.ign` Datei ist das, was CoreOS später beim ersten Boot einliest.

## Ignition-File in die Installation bekommen

Jetzt haben wir das Ignition-File - aber wie stellen wir es CoreOS bei der Installation zur Verfügung? Das ist der Punkt, wo viele scheitern. CoreOS startet ohne vorherige Konfiguration und braucht das Ignition-File bereits beim ersten Boot.

Es gibt mehrere Wege, aber der einfachste ist über eine URL. CoreOS kann das Ignition-File von einem Webserver laden. Das klingt kompliziert, ist aber mit einem lokalen HTTP-Server in wenigen Minuten gemacht.

### Lokaler HTTP-Server mit Python

Python hat einen eingebauten HTTP-Server. Im Verzeichnis mit der `config.ign` Datei:

```bash
# Python 3
python3 -m http.server 8000

# Python 2 (falls Python 3 nicht verfügbar)
python -m SimpleHTTPServer 8000
```

Die IP-Adresse des Rechners findest Du je nach System:

```bash
# Linux
ip addr show | grep "inet " | grep -v 127.0.0.1

# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows (PowerShell)
ipconfig | findstr "IPv4"
```

Wenn die IP beispielsweise `192.168.1.100` ist, dann ist das Ignition-File unter `http://192.168.1.100:8000/config.ign` erreichbar.

### Alternative Wege

- **USB-Stick**: Das Ignition-File kann auch auf einem USB-Stick mitgegeben werden
- **Cloud-Anbieter**: Bei Cloud-Providern wird das File meist über deren Metadaten-Service bereitgestellt
- **Netzwerk-Boot**: Bei PXE-Boot kann das File über TFTP bereitgestellt werden

Für den Einstieg ist der HTTP-Server der unkomplizierteste Weg.

## CoreOS Installation durchführen

### ISO herunterladen

Für die Installation wird die Fedora CoreOS ISO benötigt. Diese gibt es auf der [offiziellen Download-Seite](https://fedoraproject.org/coreos/download/). Die "Bare Metal & Virtualized" Variante ist für unsere Zwecke richtig.

Das ISO auf USB-Stick schreiben oder in der VM einbinden. CoreOS startet direkt in eine Live-Umgebung – kein Installationsassistent, nur ein Terminal.

### Installation

In der Live-Umgebung wird man automatisch als `core` Nutzer eingeloggt. Der Befehl `coreos-installer` übernimmt die Installation:

```bash
sudo coreos-installer install /dev/sda --ignition-url http://192.168.1.100:8000/config.ign --insecure-ignition
```

Die wichtigsten Parameter:

- `/dev/sda` – Ziellaufwerk (VMs nutzen meist `/dev/vda`)
- `--ignition-url` – URL zum Ignition-File
- `--insecure-ignition` – Nötig für HTTP ohne SSL

Mit `lsblk` lassen sich alle Laufwerke anzeigen, falls unklar welches das richtige ist.

### Was passiert bei der Installation?

Der Installer holt das Ignition-File, partitioniert die Platte und spielt das CoreOS-Image auf. Das Ignition-File wird dabei fest ins System integriert und beim ersten echten Boot ausgeführt.

Dauert nur wenige Minuten. Nach dem Neustart kann der HTTP-Server gestoppt werden und wird nicht mehr benötigt.

## docker-compose installieren

Nach der Installation fehlen Tools wie `vim` oder `docker-compose`. Der erste Reflex ist `dnf install` wie bei Fedora üblich – funktioniert aber nicht. CoreOS hat ein unveränderliches Dateisystem, das Root-System ist schreibgeschützt.

Software wird über `rpm-ostree` installiert:

```bash
# Software installieren
sudo rpm-ostree install vim docker-compose

# Neustart erforderlich
sudo systemctl reboot
```

Nach dem Reboot ist die Software verfügbar. Das System bleibt dabei stabil und lässt sich bei Problemen einfach zurückrollen.

Die meiste Software läuft als Container – CoreOS ist dafür optimiert. Nur System-Tools wie `vim` oder `docker-compose` werden direkt installiert.

## Docker vs Podman auf CoreOS

CoreOS kommt mit Docker und Podman vorinstalliert. Beide funktionieren gut, haben aber unterschiedliche Philosophien:

**Docker:** Klassische Container-Runtime. Braucht einen Daemon. Funktioniert mit allen bestehenden docker-compose Files und Tutorials.

**Podman:** Rootlose Container standardmäßig. Kein Daemon nötig. Bessere systemd Integration. Mehr im Einklang mit CoreOS Sicherheitsprinzipien.

Für diesen Guide verwenden wir Docker, weil es die meisten kennen. Falls Du Podman bevorzugst:

```bash
# Podman Socket für docker-compose Kompatibilität
sudo systemctl enable --now podman.socket
# Oder podman-compose installieren
sudo rpm-ostree install podman-compose
```

Beide können die gleichen Container-Images laufen lassen. Wähle je nach Vorliebe und vorhandenen Tools.

## Warum Fedora CoreOS?

CoreOS ist für Container-Workloads optimiert. Das unveränderliche System verhindert Drift und macht Updates vorhersagbar. Rolling Releases halten das System automatisch aktuell.

Für reine Container-Umgebungen ist CoreOS schlanker als ein vollständiges Fedora. Weniger installierte Pakete bedeuten weniger Angriffsfläche und weniger Wartungsaufwand.

Das System startet schnell und läuft stabil. Updates passieren automatisch im Hintergrund, ein Neustart aktiviert die neue Version. Bei Problemen ist der Rollback zur vorherigen Version möglich.

CoreOS macht Sinn für alle, die primär Container betreiben wollen. Für traditionelle Software-Installation ist ein Standard-Fedora besser geeignet.

## Fazit

Das Fedora CoreOS Setup ist nicht kompliziert, aber anders als gewohnt. Der kritische Punkt ist das Ignition-File in die Installation zu bekommen. Ein Python HTTP-Server löst das elegant.

Die Umstellung von `dnf` auf `rpm-ostree` braucht Gewöhnung. Allzu oft wird `rpm-ostree` aber eh nicht benötigt, da ja alles in Containern läuft.

CoreOS eignet sich für Container-Workloads und minimale Systeme. Linux-Einsteiger sollten erst mit Standard-Fedora Erfahrungen sammeln – CoreOS ist ein Spezialwerkzeug.

Der Test auf dem Raspberry Pi steht noch aus, könnte aber interessant werden.
