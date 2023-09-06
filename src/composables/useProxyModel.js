import { computed, toValue } from "vue"

export function useProxyModel(model, vm, eventName, callback) {
	return computed({
		get() {
			return toValue(model)
		},
		set(val) {
			vm.emit(eventName, val)
			if (callback) callback(val)
		}
	})
}