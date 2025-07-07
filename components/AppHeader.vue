<script setup lang="ts">
const { logout } = useAuthApi()
const toast = useToast()
const { user } = useSupabase()

withDefaults(
  defineProps<{
    hide?: boolean
  }>(),
  {
    hide: false,
  },
)

// State for the component
const shareableLink = ref(
  typeof window !== 'undefined'
    ? `${window.location.origin}/profile/${user.value?.user.id}`
    : '',
)
const copied = ref(false)
let timeoutId: number | null = null

// Copy link to clipboard
function copyToClipboard() {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(shareableLink.value)
    copied.value = true

    // Clear any existing timeout to prevent multiple timeouts
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Reset the copied state after 2 seconds for the next click
    timeoutId = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

async function logOutHandler() {
  try {
    await logout()
    user.value = null

    toast.add({
      title: 'Logout successful!',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    navigateTo('/auth/login')
  } catch (error: any) {
    toast.add({
      title: error.message,
      description: 'Please try again later.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  }
}
// Dropdown items with proper navigation
const dropdownItems = [
  {
    label: 'Log out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    onSelect: logOutHandler,
  },
]
</script>

<template>
  <header class="py-5 sticky top-0">
    <div class="relative">
      <!-- Background gradient effect with transition -->
      <div
        class="absolute inset-0 rounded-xl blur-xl transition-all duration-500"
        :class="
          copied
            ? 'bg-gradient-to-r from-purple-600/30 to-blue-500/30'
            : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20'
        "
      ></div>

      <!-- Content -->
      <div class="relative z-10 px-6 py-8 text-center">
        <!-- User dropdown menu positioned at top right -->
        <div
          v-if="!hide"
          class="absolute mt-2 flex rounded-full -top-5 shadow shadow-lg right-2 border border-blue-700"
        >
          <UButtonGroup>
            <UButton
              variant="subtle"
              class="rounded-full overflow-hidden p-0 shadow-xl"
            >
              <div
                class="size-12 rounded-full flex items-center justify-center"
              >
                <UAvatar
                  v-if="user?.img"
                  :src="user?.img"
                  alt="User profile"
                  size="xl"
                />
                <UIcon
                  v-else
                  name="i-mdi-account"
                  class="text-gray-400 text-3xl"
                />
              </div>
            </UButton>

            <UDropdownMenu :items="dropdownItems">
              <UButton
                color="gray"
                variant="subtle"
                icon="i-heroicons-chevron-down"
                class="hover:bg-white/30 transition-all"
              />
            </UDropdownMenu>
          </UButtonGroup>
        </div>

        <div class="flex items-center max-md:mt-4 justify-center mb-3">
          <Logo />
          <h1
            class="text-3xl md:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Share Profile Links
          </h1>
        </div>
        <p
          class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light mb-6"
        >
          Create your personalized social links page in minutes
        </p>

        <!-- Link sharing component -->
        <div v-if="!hide" class="max-w-md mx-auto mt-6">
          <!-- Share link input with copy button -->
          <div
            class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300"
            :class="{
              'shadow-purple-200/50 dark:shadow-purple-900/20': copied,
            }"
          >
            <UCard>
              <div
                :class="[
                  'flex items-center gap-2 ',
                  { 'pointer-events-none': user.noProfileCreatedYet },
                ]"
              >
                <UInput
                  v-model="shareableLink"
                  readonly
                  size="lg"
                  class="flex-grow-1 pointer-events-none"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-link" class="h-5 text-gray-400" />
                  </template>
                </UInput>

                <UButton
                  @click="copyToClipboard"
                  :class="[
                    copied
                      ? 'bg-purple-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600',
                    'transition-all duration-300 relative overflow-hidden',
                  ]"
                  size="lg"
                >
                  <!-- Using absolute positioning for the icons to enable custom animations -->
                  <div class="relative w-5 h-5">
                    <!-- Clipboard icon (moves from top) -->
                    <UIcon
                      name="i-heroicons-clipboard"
                      class="h-5 w-5 text-white absolute inset-0 transition-all duration-300"
                      :class="
                        copied
                          ? 'translate-y-8 opacity-0'
                          : 'translate-y-0 opacity-100'
                      "
                    />
                    <!-- Check icon (moves from bottom) -->
                    <UIcon
                      name="i-heroicons-check"
                      class="h-5 w-5 text-white absolute inset-0 transition-all duration-300"
                      :class="
                        copied
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-8 opacity-0'
                      "
                    />
                  </div>
                </UButton>
              </div>
            </UCard>
          </div>
          <p
            v-if="user.noProfileCreatedYet"
            class="text-md mt-4 text-gray-700 max-w-2xl"
          >
            Create your profile first to generate a shareable link
          </p>
        </div>
      </div>

      <!-- Decorative elements with transition -->
      <div
        class="absolute top-4 left-10 w-20 h-20 rounded-full blur-md transition-all duration-700"
        :class="copied ? 'bg-blue-400/30 scale-110' : 'bg-blue-300/20'"
      ></div>
      <div
        class="absolute bottom-6 right-10 w-16 h-16 rounded-full blur-md transition-all duration-700"
        :class="copied ? 'bg-purple-400/30 scale-110' : 'bg-purple-300/20'"
      ></div>
    </div>
  </header>
</template>

<style scoped>
.check-icon-animation {
  animation: checkIconPop 0.3s ease-in-out;
}

@keyframes checkIconPop {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
