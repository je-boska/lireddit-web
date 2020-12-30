import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql'
import { Layout } from '../components/Layout'
import NextLink from 'next/link'
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { UpdootSection } from '../components/UpdootSection'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })
  const [, deletePost] = useDeletePostMutation()

  if (!fetching && !data) {
    return <div>Query failed</div>
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map(post =>
            !post ? null : (
              <Flex
                align='center'
                key={post.id}
                shadow='md'
                borderWidth='1px'
                padding='20px'
              >
                <UpdootSection post={post} />
                <Box flex={1}>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {post.creator.username}</Text>
                  <Text flex={1} mt={4}>
                    {post.textSnippet}
                  </Text>
                </Box>
                <IconButton
                  ml='auto'
                  icon={<DeleteIcon />}
                  aria-label='Delete Post'
                  onClick={() => {
                    deletePost({ id: post.id })
                  }}
                />
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }}
            isLoading={fetching}
            m='auto'
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
