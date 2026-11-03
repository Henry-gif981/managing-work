import { scene } from './kit';

const to = 'anchor:f1-scope:map';
const p = scene('f1-scope', [
  {
    title: 'Subject and content',
    layout: 'right',
    source: 'Introduction 5 · p. 8',
    body: `- **Research subject:** the IBRD and its involvement in project financing. Other members of the World Bank Group, such as IDA, IFC and MIGA, are mentioned only for comparison or when needed to explain the IBRD's role.
- **Content scope:** the IBRD's formation and development, funding sources, main lending instruments, project cycle, and financial, technical and training support. It does not go into detailed technical aspects such as loan pricing formulas or the IBRD's internal risk models.`,
  },
  {
    title: 'Space and time',
    layout: 'right',
    source: 'Introduction 5 · p. 8',
    callouts: [{ from: '.k-card .h2', to, label: 'Vietnam' }],
    body: `- **Spatial scope:** Vietnam. International examples are used only when they help explain how the IBRD works in general.
- **Time scope:** from {scope-start} to the present. This period includes Vietnam's transition from IDA to IBRD lending, with special attention to the years after {scope-graduation}, when Vietnam graduated from IDA and IBRD loans became its main source of World Bank financing.`,
  },
]);
export const beats = p.beats;
export default p.View;
