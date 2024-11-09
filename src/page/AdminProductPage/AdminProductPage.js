import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  getDeletedProductList,
  deleteProduct,
  restoreProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const {
    productList,
    deletedProductList,
    totalPageNum,
    deletedTotalPageNum,
    selectedProduct,
  } = useSelector((state) => state.product);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체
  const [showDeletedProducts, setShowDeletedProducts] = useState(false);
  const [mode, setMode] = useState("new");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  useEffect(() => {
    // 검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    console.log("query", query);
    navigate("?" + query);
    // 상품리스트 가져오기 (url쿼리 맞춰서)

    if (showDeletedProducts) {
      dispatch(getDeletedProductList({ ...searchQuery }));
    } else {
      dispatch(getProductList({ ...searchQuery }));
    }
  }, [searchQuery, showDeletedProducts, navigate, dispatch]);

  const deleteItem = (product) => {
    // 아이템 삭제하기
    setSelectedProductId(product._id);
    dispatch(setSelectedProduct(product));
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(selectedProductId)).then(() => {
      // 삭제 후 최신 검색 조건으로 목록 불러오고 페이지 1로 변경
      setSearchQuery({ ...searchQuery, page: 1 });
      setShowDeleteModal(false);
      dispatch(setSelectedProduct(null));
    });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const openEditForm = (product) => {
    // edit모드로 설정하고
    setMode("edit");
    // 클릭한 아이템 정보 불러오기
    dispatch(setSelectedProduct(product));
    // 아이템 수정다이얼로그 열어주기
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    // new 모드로 설정하고
    setMode("new");
    // 다이얼로그 열어주기
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    // 쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };
  // 검색 매커니즘
  // searchBox에서 검색어를 읽어온다 => 엔터를 치면 => searchQuery객체가 업데이트가 된다. ex:{name: jacket}
  // => searchQuery 객체 안의 아이템 기준으로 url을 새로 생성해서 호출 ex: $name=jacket
  // => url쿼리 읽어오기 => 쿼리 기준으로 BE 검색 조건과 함께 호출

  const toggleDeletedProducts = () => {
    setShowDeletedProducts(!showDeletedProducts);
    setSearchQuery({ ...searchQuery, page: 1 });
  };

  const restoreItem = (product) => {
    setSelectedProductId(product._id);
    dispatch(setSelectedProduct(product));
    setShowRestoreModal(true);
  };

  const confirmRestore = () => {
    dispatch(restoreProduct(selectedProductId)).then(() => {
      setSearchQuery({ ...searchQuery, page: 1 });
      setShowRestoreModal(false);
      dispatch(setSelectedProduct(null));
    });
  };

  const cancelRestore = () => {
    setShowRestoreModal(false);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>
        <Button
          className="mt-2 mb-2 ml-2"
          variant={showDeletedProducts ? "secondary" : "warning"}
          onClick={toggleDeletedProducts}
        >
          {showDeletedProducts
            ? "Show Active Products"
            : "Show Deleted Products"}
        </Button>

        <ProductTable
          header={tableHeader}
          data={showDeletedProducts ? deletedProductList : productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
          isDeletedList={showDeletedProducts}
          restoreItem={restoreItem}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={showDeletedProducts ? deletedTotalPageNum : totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {showDeleteModal && (
        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedProduct.sku}, {selectedProduct.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 상품을 정말 삭제하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>
              취소
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              삭제
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showRestoreModal && (
        <Modal show={showRestoreModal} onHide={cancelRestore}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedProduct.sku}, {selectedProduct.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>해당 상품을 정말 복원하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelRestore}>
              취소
            </Button>
            <Button variant="success" onClick={confirmRestore}>
              복원
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminProductPage;
