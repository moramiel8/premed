import React from 'react';
import Checkbox from '../../common/Checkbox';
import Modal from '../../layout/Modal'


function EditDataPaths() {
    return (
        <Modal
        display={display}
        toggleModal={toggleModal}
        title={title}>
            <form onSubmit={handleSubmit} className="choose-path">
                <p className="choose-path-error">{errors.pathIds}</p>
                <div className="options-container">
                    {allPaths.map(path =>
                        <div 
                        key={path._id}
                        className={values.pathIds?.find(id => id === path._id)
                        ?   "path-option checked"
                        :   "path-option"}>
                            <Checkbox 
                            name="pathIds"
                            value={path._id}
                            onChange={handleChange}
                            isMulti={true}
                            checked={values.pathIds?.find(id => id === path._id) ? true : false}
                            />
                            <span className="path-name">
                                {path.name}
                            </span>
                        </div>                     
                    )}
                </div>
                
                <p className="button-block">
                    <button type="submit">
                        שמירה
                    </button>
                </p>
            </form> 
        </Modal>
    )
}

export default EditDataPaths
