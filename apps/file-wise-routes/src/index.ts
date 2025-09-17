import { mount } from 'ripple';
// @ts-expect-error: known issue, we're working on it
import { App } from './App.ripple';
import { Route } from "ripple-router-hash"
mount(Route, {
	target: document.getElementById('root'),
});
