import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, HStack, IconButton, Button, useDisclosure, Stack, Link, Text } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ children, to }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: 'gray.200',
    }}
    to={to}>
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAdmin, token, logout } = useAuth();

  const userLinks = [
    { name: 'Courses', path: '/' },
    { name: 'My Courses', path: '/my-courses' },
  ];

  const adminLinks = [
    { name: 'Courses', path: '/' },
    { name: 'Add Course', path: '/add-course' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <Box bg={'white'} px={4} boxShadow={'sm'}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              Coursify
            </Text>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <NavLink key={link.name} to={link.path}>
                {link.name}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          {token ? (
            <Button
              variant={'outline'}
              colorScheme={'blue'}
              size={'sm'}
              mr={4}
              onClick={logout}>
              Logout
            </Button>
          ) : (
            <HStack>
              <Button
                as={RouterLink}
                to="/login"
                variant={'outline'}
                colorScheme={'blue'}
                size={'sm'}
                mr={4}>
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme={'blue'}
                size={'sm'}>
                Sign Up
              </Button>
            </HStack>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {links.map((link) => (
              <NavLink key={link.name} to={link.path}>
                {link.name}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
} 