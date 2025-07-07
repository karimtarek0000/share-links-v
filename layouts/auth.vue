<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center px-4 py-12"
  >
    <div class="flex items-center mb-8">
      <Logo />
      <h1
        class="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
      >
        Share Profile Links
      </h1>
    </div>
    <slot />
  </main>
</template>
