import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChooseCalcs from './choose-calcs/ChooseCalcs';
import Modal from '../../../layout/Modal';
import CalculatorContent from './CalculatorContent';
import GroupsProvider from '../data-block/GroupsContext';

function CalculatorBody({ display, toggleModal }) {
    const [chosenCalcs, setChosenCalcs] = useState([])

    /* When the user has chosen calcs but wants to change them,
        this state tells react to render ChooseCalcs */
    const [pickCalcs, setPickCalcs] = useState(true)
    const togglePickCalcs = toggle => {
        setPickCalcs(toggle)
    }

    // A function that finds and adds new calcs to the chosen calcs
    const chooseCalc = calc => {
        if(chosenCalcs.find(thisCalc => thisCalc._id === calc._id))
            setChosenCalcs(chosenCalcs.filter(thisCalc => 
                thisCalc._id !== calc._id))

        else 
            setChosenCalcs([...chosenCalcs, calc]) 
    }

    const clearCalcs = () => {
        setChosenCalcs([])
    }

    const chooseAllCalcs = calcs => {
        setChosenCalcs(calcs)
    }

    return (
        <Modal
        display={display}
        title="המחשבון"
        toggleModal={toggleModal}>
            {pickCalcs 
            ?   <ChooseCalcs 
                chosenCalcs={chosenCalcs}
                chooseCalc={chooseCalc}
                clearCalcs={clearCalcs}
                chooseAllCalcs={chooseAllCalcs}
                togglePickCalcs={togglePickCalcs} />
            
            :   
            <GroupsProvider isSimulated={true}>
                <CalculatorContent
                display={display}
                chosenCalcs={chosenCalcs}
                togglePickCalcs={togglePickCalcs} />
            </GroupsProvider>
            }
        </Modal>
    )
}

CalculatorBody.propTypes = {
    display: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired
}

export default CalculatorBody
