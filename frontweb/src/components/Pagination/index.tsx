import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import ReactPaginate from 'react-paginate';
import './styles.css';

type Props = {
  pageCount: number,
  range: number,
  onChange?: (pageNumber: number) => void;
}

const Pagination = ( { pageCount, range, onChange }: Props) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={range}
      marginPagesDisplayed={1}
      containerClassName="component-container"
      pageLinkClassName="pagination-item"
      breakClassName="pagination-item"
      activeLinkClassName="pagination-link-active"
      previousClassName="arrow-previous"
      previousLabel={<ArrowIcon />}
      nextClassName="arrow-next"
      nextLabel={<ArrowIcon />}
      disabledClassName="arrow-inactive"

      onPageChange={(items) => (onChange) ? onChange(items.selected) : {}} //items.select = page selected in React Paginate
    />
  );
};

export default Pagination;
