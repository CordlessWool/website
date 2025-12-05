---
title: "Fedora CoreOS Setup Guide – Ignition Files Without the Frustration"
topic: "Container"
description: Step-by-step guide for Fedora CoreOS installation with Ignition files. Python HTTP server, Butane conversion, and practical tips without detours.
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

# Fedora CoreOS Setup Guide – Ignition Files Without the Frustration

Fedora CoreOS setup usually doesn't fail because of complexity, but because of the missing entry point. The documentation is comprehensive - perfect as a reference, but not ideal for the first setup. Anyone who only occasionally installs CoreOS often faces the question: How do you actually get the Ignition file into the system? That's exactly what this guide explains.

This article shows how to build a working Fedora CoreOS system from scratch. The Ignition file is created step by step – with SSH access and everything needed to get started. The structure is relatively simple and easy to understand, with just one SSH public key for the `core` user.

CoreOS works differently than traditional Linux installations – everything is defined upfront instead of configured afterwards. Once understood, the approach is convincing.

---

**TL;DR - Quick Reference:**

1. **Create Ignition file:** Write YAML file with SSH key (`config.bu`)
2. **Convert to JSON:** `docker run --rm -i quay.io/coreos/butane:release --strict < config.bu > config.ign`
3. **Start HTTP server:** `python3 -m http.server 8000` in directory with .ign file
4. **Find IP address:** `ip addr show | grep "inet " | grep -v 127.0.0.1` (Linux)
5. **Boot CoreOS ISO** and install: `sudo coreos-installer install /dev/sda --ignition-url http://IP:8000/config.ign --insecure-ignition`
6. **Reboot** - CoreOS is ready to go

---

## Creating the Ignition File

The Ignition file is a JSON file that describes the complete system before it gets installed. Instead of creating users and configuring SSH keys after installation, everything happens automatically during the first boot.

The easiest way is to write a human-readable YAML file and then convert it to JSON using Butane. For getting started, a minimal setup with SSH access for the default user is sufficient:

```yaml
# config.bu
variant: fcos
version: 1.6.0
passwd:
  users:
    - name: core
      ssh_authorized_keys:
        - "ssh-rsa AAAAB3NzaC1yc2EAAAA... your-public-key"
systemd:
  units:
    - name: docker.service
      enabled: true
```

This configuration defines SSH access for the default user `core` and ensures Docker starts automatically on boot. The `variant: fcos` specifies that this is for Fedora CoreOS, the version determines the schema. CoreOS comes with the `core` user already preconfigured – it just needs an SSH key.

**Why enable Docker?** Docker is available on CoreOS and the `docker` command works, but containers don't run properly until you enable the Docker service permanently. Without the `systemd` section, you'd have to nudge Docker after each reboot. The Ignition approach permanently enables it from the start.

Alternatively, you can enable Docker manually later:

```bash
# Enable Docker permanently after installation
sudo systemctl enable --now docker
```

This YAML file (with `.bu` extension) is then converted with Butane to a `.ign` JSON file that CoreOS understands.

### From YAML to JSON – The Butane Conversion

The YAML file is human-readable, but CoreOS only understands JSON. That's where Butane comes in – a tool that handles the conversion and also checks the syntax.

Butane runs easiest as a container. With Docker or Podman:

```bash
docker run --rm -i quay.io/coreos/butane:release --strict < config.bu > config.ign
```

Alternatively, Butane can also be installed as a local binary if Docker is not available.

The `--strict` parameter ensures that Butane aborts on errors instead of ignoring warnings.

The result is a `config.ign` file in JSON format that Ignition understands:

```json
{
  "ignition": {
    "version": "3.5.0"
  },
  "passwd": {
    "users": [
      {
        "name": "core",
        "sshAuthorizedKeys": ["ssh-rsa AAAAB3NzaC1yc2EAAAA... your-public-key"]
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

This `.ign` file is what CoreOS reads during the first boot.

## Getting the Ignition File into the Installation

Now we have the Ignition file - but how do we make it available to CoreOS during installation? This is where many people fail. CoreOS starts without prior configuration and needs the Ignition file already during the first boot.

There are several ways, but the easiest is via URL. CoreOS can load the Ignition file from a web server. This sounds complicated, but with a local HTTP server it's done in minutes.

### Local HTTP Server with Python

Python has a built-in HTTP server. In the directory with the `config.ign` file:

```bash
# Python 3
python3 -m http.server 8000

# Python 2 (if Python 3 is not available)
python -m SimpleHTTPServer 8000
```

You can find the IP address of your machine depending on the system:

```bash
# Linux
ip addr show | grep "inet " | grep -v 127.0.0.1

# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows (PowerShell)
ipconfig | findstr "IPv4"
```

If the IP is for example `192.168.1.100`, then the Ignition file is available at `http://192.168.1.100:8000/config.ign`.

### Alternative Methods

- **USB stick**: The Ignition file can also be provided on a USB stick
- **Cloud providers**: With cloud providers, the file is usually provided via their metadata service
- **Network boot**: With PXE boot, the file can be provided via TFTP

For getting started, the HTTP server is the most straightforward approach.

## Performing the CoreOS Installation

### Download ISO

The Fedora CoreOS ISO is needed for installation. It's available on the [official download page](https://fedoraproject.org/coreos/download/). The "Bare Metal & Virtualized" variant is right for our purposes.

Write the ISO to a USB stick or mount it in a VM. CoreOS boots directly into a live environment – no installation wizard, just a terminal.

### Installation

The live environment automatically logs in as the `core` user. The `coreos-installer` command handles the installation:

```bash
sudo coreos-installer install /dev/sda --ignition-url http://192.168.1.100:8000/config.ign --insecure-ignition
```

The important parameters:

- `/dev/sda` – Target drive (VMs usually use `/dev/vda`)
- `--ignition-url` – URL to the Ignition file
- `--insecure-ignition` – Required for HTTP without SSL

Use `lsblk` to show all drives if unclear which is the right one.

### What Happens During Installation?

The installer fetches the Ignition file, partitions the disk, and installs the CoreOS image. The Ignition file gets integrated into the system and executes during the first real boot.

Takes only a few minutes. After reboot, the HTTP server can be stopped and is no longer needed.

## Installing docker-compose

After installation, tools like `vim` or `docker-compose` are missing. The first reflex is `dnf install` as usual with Fedora – but that doesn't work. CoreOS has an immutable filesystem, the root system is read-only.

Software is installed via `rpm-ostree`:

```bash
# Install software
sudo rpm-ostree install vim docker-compose

# Reboot required
sudo systemctl reboot
```

After reboot, the software is available. The system remains stable and can be easily rolled back if there are problems.

Most software runs as containers – CoreOS is optimized for that. Only system tools like `vim` or `docker-compose` are installed directly.

## Docker vs Podman on CoreOS

CoreOS ships with both Docker and Podman pre-installed. Both work fine, but they have different philosophies:

**Docker:** Traditional container runtime. Requires a daemon. Works with all existing docker-compose files and tutorials.

**Podman:** Rootless containers by default. No daemon required. Better systemd integration. More aligned with CoreOS security principles.

For this guide, we use Docker because most people are familiar with it. If you prefer Podman:

```bash
# Enable Podman socket for docker-compose compatibility
sudo systemctl enable --now podman.socket
# Or install podman-compose
sudo rpm-ostree install podman-compose
```

Both can run the same container images. Choose based on your preference and existing tooling.

## Why Fedora CoreOS?

CoreOS is optimized for container workloads. The immutable system prevents drift and makes updates predictable. Rolling releases keep the system automatically up to date.

For pure container environments, CoreOS is leaner than a full Fedora. Fewer installed packages mean less attack surface and less maintenance overhead.

The system boots fast and runs stable. Updates happen automatically in the background, a reboot activates the new version. If there are problems, rollback to the previous version is possible.

CoreOS makes sense for everyone who primarily wants to run containers. For traditional software installation, a standard Fedora is better suited.

## Conclusion

The Fedora CoreOS setup is not complicated, but different from what you're used to. The critical point is getting the Ignition file into the installation. A Python HTTP server solves this elegantly.

The switch from `dnf` to `rpm-ostree` takes some getting used to. But `rpm-ostree` isn't needed that often anyway, since everything runs in containers.

CoreOS is suitable for container workloads and minimal systems. Linux beginners should first gain experience with standard Fedora – CoreOS is a specialized tool.

The test on Raspberry Pi is still pending, but could be interesting.
