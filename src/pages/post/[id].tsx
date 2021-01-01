import { Box, Heading } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons'
import { Layout } from '../../components/Layout'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl()

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    )
  }

  const {
    title,
    text,
    id,
    creator: { id: creatorId },
  } = data?.post

  return (
    <Layout>
      <Heading mb={4}>{title}</Heading>
      <Box mb={4}>{text}</Box>
      <EditDeletePostButtons id={id} creatorId={creatorId} />
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
