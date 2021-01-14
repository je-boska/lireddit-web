import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { EditDeletePostButtons } from '../components/EditDeletePostButtons'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import Head from 'next/head'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  })
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return (
      <div>
        <div>Query failed:</div>
        <div>{error?.message}</div>
      </div>
    )
  }

  return (
    <Layout>
      <Head>
        <title>LiReddit</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
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
                <Box ml='auto'>
                  <EditDeletePostButtons
                    id={post.id}
                    creatorId={post.creator.id}
                  />
                </Box>
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
