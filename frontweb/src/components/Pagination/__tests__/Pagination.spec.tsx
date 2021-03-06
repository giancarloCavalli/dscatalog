import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '..';

describe("Pagination tests", () => {

  test("should render 3 pagination page icons when given range and pageCount = 3", () => {

    const pageCount = 3;
    const range = 3;

    render(
      <Pagination
        pageCount={pageCount}
        range={range}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).not.toBeInTheDocument();
  })

  test("should render initially page1 as the only active page", () => {

    const pageCount = 3;
    const range = 3;

    render(
      <Pagination
        pageCount={pageCount}
        range={range}
      />
    );

    const page1 = screen.getByText("1");
    const page2 = screen.getByText("2");
    const page3 = screen.getByText("3");

    expect(page1).toBeInTheDocument();
    expect(page1).toHaveClass("pagination-link-active");

    expect(page2).toBeInTheDocument();
    expect(page2).not.toHaveClass("pagination-link-active");

    expect(page3).toBeInTheDocument();
    expect(page3).not.toHaveClass("pagination-link-active");
  })

  test("next arrow click should call onChange with next index", () => {

    const pageCount = 3;
    const range = 3;
    const onChange = jest.fn();
    
    render(
      <Pagination
      pageCount={pageCount}
      range={range}
      onChange={onChange}
      />
      );
      
      const arrowNext = screen.getByTestId("arrow-next");
      
      userEvent.click(arrowNext);
      expect(onChange).toHaveBeenCalledWith(1);
    })
    
    test("previous arrow click should call onChange with previous index", () => {
      
      const pageCount = 3;
      const range = 3;
      const onChange = jest.fn();
      const forcePage= 1;

    render(
      <Pagination
        pageCount={pageCount}
        range={range}
        onChange={onChange}
        forcePage={forcePage}
      />
    );

    const arrowPrevious = screen.getByTestId("arrow-previous");

    userEvent.click(arrowPrevious);
    expect(onChange).toHaveBeenCalledWith(0);
  })
    
    test("page link click should call onChange with page index", () => {
      
      const pageCount = 3;
      const range = 3;
      const onChange = jest.fn();

    render(
      <Pagination
        pageCount={pageCount}
        range={range}
        onChange={onChange}
      />
    );

    const page2 = screen.getByText("2");

    userEvent.click(page2);
    expect(onChange).toHaveBeenCalledWith(1);
  })
});