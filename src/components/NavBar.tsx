import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery()
  let body = null

  // data is loading
  if (fetching) {
    // user is not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex align='center'>
        <NextLink href='/create-post'>
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>
          <Text color='white'>{data.me.username}</Text>
        </Box>
        <Button
          onClick={() => {
            logout()
          }}
          isLoading={logoutFetching}
          variant='link'
        >
          log out
        </Button>
      </Flex>
    )
  }

  return (
    <Flex
      zIndex={1}
      position='sticky'
      top={0}
      bg='black'
      p={4}
      justify='center'
    >
      <Flex flex={1} align='center' maxW={800}>
        <NextLink href='/'>
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  )
}
