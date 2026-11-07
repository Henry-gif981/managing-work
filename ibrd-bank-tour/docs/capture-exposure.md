# Print background exposure (npm run capture-bg)

Each scene starts at exposure 1.0 (linear tone mapping, no post-processing). An image is rejected if more than 25% of its pixels are above luminance 245 or its mean luminance is above 0.90; exposure and the exit-hall light are then lowered by 15% and the image is captured again (at most 4 retries).

| Scene | Final exposure | Tries | Pixels > 245 | Mean luminance | SD |
|---|---|---|---|---|---|
| `ext-facade` | 1.000 | 1 | 6.5% | 0.853 | 28.8 |
| `ext-door` | 0.850 | 2 | 0.0% | 0.826 | 37.4 |
| `f1-rationale-2` | 1.000 | 1 | 14.5% | 0.892 | 25.9 |
| `f1-problem` | 1.000 | 1 | 23.0% | 0.889 | 27.3 |
| `f1-structure` | 0.850 | 2 | 0.0% | 0.825 | 36.0 |
| `f1-ch1-title` | 1.000 | 1 | 15.6% | 0.788 | 57.7 |
| `f1-what` | 0.850 | 2 | 0.1% | 0.770 | 53.7 |
| `f1-wbg` | 1.000 | 1 | 22.7% | 0.746 | 65.6 |
| `f1-history-1` | 1.000 | 1 | 16.8% | 0.771 | 55.2 |
| `f1-history-2` | 1.000 | 1 | 7.5% | 0.774 | 45.9 |
| `f1-gov` | 1.000 | 1 | 15.7% | 0.794 | 66.0 |
| `f1-funds` | 1.000 | 1 | 8.8% | 0.831 | 35.5 |
| `f1-instruments` | 1.000 | 1 | 19.1% | 0.816 | 57.1 |
| `f1-terms` | 0.850 | 2 | 0.0% | 0.798 | 45.9 |
| `f1-safeguards` | 0.850 | 2 | 0.1% | 0.834 | 26.7 |
| `lift-1-2` | 1.000 | 1 | 7.1% | 0.716 | 45.2 |
| `f2-ch2-title` | 0.850 | 2 | 0.1% | 0.791 | 43.1 |
| `f2-cycle` | 0.850 | 2 | 0.0% | 0.727 | 62.7 |
| `f2-vn-procedures` | 0.850 | 2 | 0.0% | 0.785 | 57.0 |
| `f2-disbursement` | 0.850 | 2 | 0.0% | 0.834 | 27.7 |
| `f2-counterpart` | 0.850 | 2 | 0.1% | 0.785 | 44.3 |
| `f2-ipf` | 0.850 | 2 | 0.0% | 0.684 | 70.9 |
| `f2-dpf` | 0.850 | 2 | 0.0% | 0.725 | 62.7 |
| `f2-pforr` | 0.850 | 2 | 0.0% | 0.766 | 59.2 |
| `f2-prep` | 0.850 | 2 | 0.6% | 0.862 | 16.3 |
| `f2-asa` | 0.850 | 2 | 0.1% | 0.651 | 75.8 |
| `f2-me` | 0.850 | 2 | 0.0% | 0.835 | 25.5 |
| `f2-training-pmu` | 0.850 | 2 | 0.0% | 0.739 | 63.5 |
| `f2-training-knowledge` | 1.000 | 1 | 8.0% | 0.750 | 68.4 |
| `f2-institutional` | 0.850 | 2 | 0.0% | 0.812 | 44.5 |
| `f2-three-forms` | 0.850 | 2 | 0.0% | 0.802 | 44.3 |
| `f2-package` | 0.850 | 2 | 0.0% | 0.762 | 53.3 |
| `lift-2-3` | 1.000 | 1 | 6.2% | 0.701 | 46.3 |
| `f3-ch3-title` | 0.850 | 2 | 4.8% | 0.779 | 53.9 |
| `f3-1993` | 1.000 | 1 | 12.7% | 0.842 | 51.4 |
| `f3-ida-graduation` | 0.850 | 2 | 0.9% | 0.782 | 62.0 |
| `f3-sahep` | 0.850 | 2 | 0.0% | 0.845 | 30.4 |
| `f3-legal` | 0.850 | 2 | 0.0% | 0.766 | 63.5 |
| `f3-tep-overview` | 0.850 | 2 | 0.0% | 0.730 | 65.1 |
| `f3-tep-cost` | 0.850 | 2 | 23.8% | 0.793 | 62.9 |
| `f3-tep-financing` | 0.850 | 2 | 8.2% | 0.777 | 57.2 |
| `f3-tep-impl` | 0.723 | 3 | 0.0% | 0.769 | 44.9 |
| `f3-tep-outputs` | 0.850 | 2 | 23.5% | 0.763 | 59.5 |
| `f3-tep-outcomes` | 1.000 | 1 | 23.2% | 0.874 | 32.2 |
| `f3-tep-gap` | 0.850 | 2 | 14.1% | 0.856 | 16.8 |
| `f3-tep-assess` | 0.850 | 2 | 23.9% | 0.800 | 53.4 |
| `f3-ccsep-overview` | 0.850 | 2 | 18.1% | 0.804 | 49.0 |
| `f3-ccsep-structure` | 0.850 | 2 | 18.2% | 0.836 | 38.1 |
| `f3-ccsep-cities` | 0.850 | 2 | 13.4% | 0.879 | 30.4 |
| `f3-ccsep-impl` | 0.723 | 3 | 13.0% | 0.855 | 26.6 |
| `f3-ccsep-results` | 0.723 | 3 | 0.0% | 0.814 | 35.0 |
| `f3-ccsep-nhatrang` | 0.850 | 2 | 12.8% | 0.869 | 35.8 |
| `f3-eval-achievements` | 1.000 | 1 | 20.2% | 0.689 | 82.8 |
| `f3-eval-limitations` | 1.000 | 1 | 7.7% | 0.653 | 81.8 |
| `f3-recs-1` | 1.000 | 1 | 6.0% | 0.603 | 84.1 |
| `f3-recs-2` | 1.000 | 1 | 10.2% | 0.683 | 89.2 |
| `lift-down` | 1.000 | 1 | 7.0% | 0.712 | 46.3 |
| `ex-sources` | 1.000 | 1 | 17.3% | 0.869 | 33.3 |
| `ex-thanks` | 0.522 | 5 | 15.1% | 0.823 | 40.6 |
