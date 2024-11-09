import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";

const ProductTable = ({
  header,
  data,
  deleteItem,
  openEditForm,
  isDeletedList,
  restoreItem,
}) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id}>
                <th>{index}</th>
                <th>{item.sku}</th>
                <th style={{ minWidth: "100px" }}>{item.name}</th>
                <th>{currencyFormat(item.price)}</th>
                <th>
                  {Object.keys(item.stock).map((size, index) => (
                    <div key={index}>
                      {size}:{item.stock[size]}
                    </div>
                  ))}
                </th>
                <th>
                  <img src={item.image} width={100} alt="product_image" />
                </th>
                <th>{item.status}</th>
                <th style={{ minWidth: "100px" }}>
                  {isDeletedList ? (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => restoreItem(item)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteItem(item)}
                        className="mr-1"
                      >
                        -
                      </Button>
                      <Button size="sm" onClick={() => openEditForm(item)}>
                        Edit
                      </Button>
                    </>
                  )}
                </th>
              </tr>
            ))
          ) : (
            <tr>No Data to show</tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default ProductTable;
