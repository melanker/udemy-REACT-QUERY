import {useEffect, useState} from "react";

import {PostDetail} from "./PostDetail";
import {useQuery, useQueryClient} from "react-query";

const maxPostPage = 10;

async function fetchPosts(page) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`,
        {
            staleTime: 2000,
            keepPreviousData: true,
        }
    );
    return response.json();
}

export function Posts() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (currentPage < maxPostPage) {
            const nextPage = currentPage + 1;
            queryClient.prefetchQuery(["posts", nextPage], () => fetchPosts(nextPage))
        }
    }, [currentPage, queryClient])

    // replace with useQuery
    const {data, isLoading, isError} = useQuery(['posts', currentPage], () => fetchPosts(currentPage));

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Something went wrong</div>

    return (
        <>
            <ul>
                {data.map((post) => (
                    <li
                        key={post.id}
                        className="post-title"
                        onClick={() => setSelectedPost(post)}
                    >
                        {post.title}
                    </li>
                ))}
            </ul>
            <div className="pages">
                <button disabled={currentPage <= 1}
                        onClick={() => {
                            setCurrentPage(prev => prev - 1)
                        }}>
                    Previous page
                </button>
                <span>Page {currentPage}</span>
                <button disabled={currentPage >= maxPostPage}
                        onClick={() => {
                            setCurrentPage(prev => prev + 1)
                        }}>
                    Next page
                </button>
            </div>
            <hr/>
            {selectedPost && <PostDetail post={selectedPost}/>}
        </>
    );
}
