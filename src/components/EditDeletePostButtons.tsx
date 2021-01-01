import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'

interface EditDeletePostButtonsProps {
  id: number
  creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery()

  const [, deletePost] = useDeletePostMutation()

  if (creatorId !== meData?.me?.id) {
    return null
  }

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={2}
          icon={<EditIcon />}
          aria-label='Edit Post'
        />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label='Delete Post'
        onClick={() => {
          deletePost({ id })
        }}
      />
    </Box>
  )
}
