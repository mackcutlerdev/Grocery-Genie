import React, { useState, Fragment } from 'react';

const ShoppingList = (props) =>
{
    const { items, isLoading, onAddItem, onUpdateItem, onDeleteItem } = props;
    const UNITS = ['Unit','g','kg','ml','L','cup','tbsp','tsp','Box','oz','Package'];

    return (
        <Fragment>
            <div className="gg-panel active" id="panel-sources">
                {/* Table */}
                <div className="gg-table-wrap">
                    <table className="gg-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Apples</td>
                                <td>5</td>
                                <td>pieces</td>
                                <td>false</td>
                            </tr>
                            <tr>
                                <td>Bananas</td>
                                <td>3</td>
                                <td>pieces</td>
                                <td>false</td>
                            </tr>
                            <tr>
                                <td>Carrots</td>
                                <td>10</td>
                                <td>pieces</td>
                                <td>false</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
}

export default ShoppingList;