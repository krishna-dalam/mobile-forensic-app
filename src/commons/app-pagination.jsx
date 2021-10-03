import React from 'react';
import { Pagination } from "react-bootstrap";
import _ from 'lodash';

export default function AppPagination(props) {
    const {itemsCount, pageSize, currentPage, onPageChange, onFirstPageClicked, onLastPageClicked, onPrevPageClicked, onNextPageClicked} = props;

    const pagesCount = Math.ceil(itemsCount/pageSize);

    if(pagesCount === 1 || pagesCount === 0) return null;

    const pages = _.range(1, pagesCount+1);

    const tenPages = _.range(currentPage, currentPage+11);


    const displayPageNumbers = () => {
        if(pagesCount <= 10)
            return pages.map(page => <Pagination.Item onClick={() => onPageChange(page)} active={page === currentPage ? true: false}>{page}</Pagination.Item>);
        return tenPages.map(page => <Pagination.Item onClick={() => onPageChange(page)} active={page === currentPage ? true: false}>{page}</Pagination.Item>);
    }

    return (
        <Pagination>
            <Pagination.First onClick={onFirstPageClicked}/>
            <Pagination.Prev onClick={onPrevPageClicked} />
            {displayPageNumbers()}
            <Pagination.Next onClick={() => onNextPageClicked(pagesCount)} />
            <Pagination.Last onClick={() => onLastPageClicked(pagesCount)} />
        </Pagination>
    )
}
