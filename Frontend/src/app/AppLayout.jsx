import React from 'react'
import { Outlet } from 'react-router'
import Nav from '../shared/components/nav'

export default function AppLayout() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Outlet />
      </main>
    </>
  )
}
