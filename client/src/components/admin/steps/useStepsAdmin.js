import { useState } from 'react'
import useStepsGlobal from '../../steps/hooks/useStepsGlobal';

function useStepsAdmin() {
  const [selPath, setSelPath] = useState({ value: 'six-year', label: 'שש-שנתי' });

  const selectPath = selected => setSelPath(selected);

  const [selStep, setSelStep] = useState({});
  const [displayEdit, setDisplayEdit] = useState(false);

  const pathId = selPath?.value;

  const toggleEdit = toggle => setDisplayEdit(toggle);

  const selectStep = (event, step) => {
    if (event) event.stopPropagation();
    setSelStep(step);
    setDisplayEdit(true);
  }

  const stepsGlobal = useStepsGlobal(pathId);

  return {
    pathId,
    selectPath,
    selStep,
    selectStep,
    displayEdit,
    toggleEdit,
    isStepsAdmin: true,
    ...stepsGlobal
  }
}

export default useStepsAdmin
