import React from 'react'

function ItemContent({ item }) {
    if (!item) return null;

    const contentStyle = {
        borderColor: item.color
    };

    return (
        <div
            style={contentStyle}
            className="tab-item-content ck-editor"
            dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
        />
    );
}


export default ItemContent
