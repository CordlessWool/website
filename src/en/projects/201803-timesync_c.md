---
name: Locating in a Museum
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
  remove-letters: 307
tags: project
---

While study time at Beuth University, we developed a project to find orientation in a Museum. The main goal was to get the position of a Person and give information about the locations. We thought about Wlan or Bluetooth beacons but decide to use a sound signal.

For getting the position a device have to measure the difference of three signals. To get the time gap it is needed to have the three speakers synchronized, so one important part was time sync between the speaker controllers. The first Implementation was done in python because of the jitter we moved to C.
