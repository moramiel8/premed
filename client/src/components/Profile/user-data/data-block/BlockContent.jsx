import React, { useContext } from 'react'
import { Fragment } from 'react'
import filterSlaves from '../filterSlaves'
import SlavesList from './slaves/SlavesList'
import CustomGroup from './CustomGroup'
import FormFragment from './FormFragment'
import { GroupsContext } from './GroupsContext'
import GroupsList from './GroupsList'
import OptionalGroup from './OptionalGroup'
import StagedGroups from './staged-groups/StagedGroups'
import useSortGroups from './useSortGroups'

function BlockContent({
    fields, 
    groups, 
    group, 
    calcs, 
    getChildren
}) {

    const {
        customGroups,
        stagedGroupsList,
        isSimulated
    } = useContext(GroupsContext)

    const {
        reqGroups,
        optGroups,
        unUsedGroups
    } = useSortGroups(group, groups, stagedGroupsList)

    const {
        nonSlaves,
        slaves
    } = filterSlaves(fields)

    return (
        <div className="data-block-content">
            {calcs?.length > 0 &&
                <div className="data-block-fragment calcs">
                    {calcs.map(calc =>
                        <FormFragment
                        key={calc._id}
                        field={calc}
                        isCalc={true} />
                    )}
                </div>
            }
            
            
            {(!group || !isSimulated) &&
                <Fragment>
                    <div className="data-block-fragment">
                        {nonSlaves?.map(field => 
                            (!field.isType || 
                            !isSimulated) &&
                            <FormFragment
                            key={field._id}
                            field={field}
                            group={group}
                            isCalc={false} />
                        )}
                    </div>
                    <SlavesList
                    slaves={slaves} />
                </Fragment>
               
            }
            
            
            {groups && groups.length > 0 && 
            <div className={`groups-block
            ${isSimulated ? 'simulated' : ''}`}>
                {reqGroups?.map(group => 
                    <GroupsList
                    group={group}
                    groups={getChildren(group)}
                    getChildren={getChildren} />
                )}

                {optGroups?.map(group =>
                    <OptionalGroup
                    group={group}
                    groups={getChildren(group)}
                    getChildren={getChildren} />
                )}

                {customGroups?.map(group =>
                    <CustomGroup
                    customGroup={group}
                    groups={groups} />
                )}
                <StagedGroups 
                groups={unUsedGroups}
                getChildren={getChildren} />
            </div>
            }
        </div>
    )
}

export default BlockContent
