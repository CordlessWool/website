---
title: Locating in a Museum
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

While studying at Beuth University, two colleagues and I began developing a software to assist visitors in orienting themselves within a museum. Our objective was to determine the position of a person and provide information about the locations. We initially considered using WiFi or Bluetooth beacons, but ultimately opted for a sound signal.

To determine the position, the device must measure the difference between three signals. To obtain the time gap, it is necessary to synchronise the three speakers. This required synchronising the time between the speaker controllers. The initial implementation was carried out in Python due to the jitter, and the software was subsequently rewritten in C.
