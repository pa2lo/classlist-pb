import { ref } from "vue"
import PocketBase from 'pocketbase'

const pb = ref(null)

export function usePocketBase() {
	if (pb.value) return pb.value

	pb.value = new PocketBase(import.meta.env.VITE_PB_URL)

	return pb.value
}