
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function (exports) {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (251:0) {:else}
    function create_else_block$8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var services = [{
            id: 0,
            title: 'Doprava zadarmo',
            subtitle: 'pri objedn??vke nad 100???',
            icon: 'fas fa-shipping-fast',
        },
        {
            id: 1,
            title: 'Podpora 24/7',
            subtitle: 'kontaktujte n??s kedyko??vek',
            icon: 'fas fa-headphones-alt',
        },
        {
            id: 2,
            title: 'Bezpe??n?? platba',
            subtitle: '100% zabezpe??en?? platby',
            icon: 'fas fa-credit-card',
        },
        {
            id: 3,
            title: 'R??chle reklam??cie',
            subtitle: 'z pohodlia v????ho domova',
            icon: 'fas fa-undo',
        },
    ];

    var products = [{
            id: 0,
            category: 0,
            title: 'Samsung Galaxy S22',
            version: 'Ultra',
            price: 1259.99,
            discount_bollean: false,
            producer: 'Samsung',
            availability: 'Predobjedn??vky',
            colors: [{
                    title: '??ierna',
                    hex: '#000'
                },
                {
                    title: 'Biela',
                    hex: '#f8f8ff'
                },
                {
                    title: 'Zelen??',
                    hex: '#2E8B57'
                },
                {
                    title: 'Zlatoru??ov??',
                    hex: '#F2D1CB'
                }
            ],
            description_title: 'Galaxy S22 Ultra: Epick?? smartf??n s inteligentn??m perom S Pen',
            description: 'S22 Ultra predstavuje to najlep??ie vo svete smartf??nov.??i ide o kvalitu fotografovania, v??kon, alebo revolu??n?? funkcie, nem?? ??iadne slabiny.Od za??iatku si zamilujete poh??ad na jeho n??dhern?? 6, 8 " Dynamic AMOLED 2X displej s QHD+ rozl????en??m, 120 Hz technol??giou a jasom a?? 1 750 nitov pre perfektn?? ??itate??nos?? za ka??dej situ??cie! Galaxy S22 Ultra ale novo pon??ka aj integrovan?? stylus S Pen pre zv????enie produktivity alebo 108 Mpx fotoapar??t s p??sobiv??mi schopnos??ami a 3?? aj 10?? optick?? zoom!',
            short_description: 'Zozn??mte sa s Galaxy S22 Ultra s v??konom Galaxy Note. Je ??t??hly a odv????ny ??? le??ten?? r??mik obklopuje vylisovan?? tvar a zais??uje elegantn?? symetriu.',
            image_urls: ['https://www.datart.sk/foto/ilustrace/800/6/9/3/product_4909396.jpg', 'https://www.datart.sk/foto/500/4/9/3/product_4909394.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/9/3/product_4909398.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/0/4/product_4909404.jpg'],
            png_image: 'https://images.samsung.com/sk/smartphones/galaxy-s22-ultra/images/galaxy-s22-ultra_jump_models_s.png',
        },
        {
            id: 1,
            category: 0,
            title: 'Apple iPhone 13',
            version: 'Pro',
            price: 1149.00,
            discount_bollean: true,
            discount_price: 989.90,
            producer: 'Apple',
            availability: 'Na sklade',
            colors: [{
                    title: 'Modr??',
                    hex: '#8e9dba'
                },
                {
                    title: 'Zelen??',
                    hex: '#2E8B57'
                },
                {
                    title: '??ierna',
                    hex: '#393a3f'
                },
                {
                    title: 'Biela',
                    hex: '#e0dbd5'
                },
                {
                    title: '??erven??',
                    hex: '#c22c45'
                }
            ],
            description_title: 'Apple iPhone 13 Pro',
            description: 'iPhone 13 Pro je t??m najlep????m od Applu. Nedovo??uje tak kompromisy ??? vylep??uje sa na mnoh??ch frontoch s cie??om uspokoji?? najn??ro??nej????ch z??kazn??kov. M?? e??te jasnej???? 6,1" OLED displej, ktor?? zaist?? superr??chle zobrazenie v??aka adapt??vnej frekvencii a?? 120 Hz! Z??aleka to v??ak nie s?? jedin?? vylep??enia, ktor??mi si v??s z??ska. Serv??ruje aj ??pi??kov?? v??kon procesora Apple A15 Bionic s 5-jadrov??m GPU, v??aka ktor??mu sa otv??raj?? nov?? mo??nosti aj v ??al????ch oblastiach, ako napr??klad nat????anie vide??, kde je ve??kou novinkou film??rsky re??im, s ktor??m nato????te sn??mky ako hollywoodski k??zeln??ci.',
            short_description: 'smartf??n ??? 6,1" uhloprie??ka ??? OLED displej ??? 2532 ?? 1170 px ??? obnovovacia frekvencia 120 Hz ??? procesor Apple A15 Bionic (6-jadrov??) ??? intern?? pam???? 128 GB ??? zadn?? fotoapar??t 12 (f/1.5) + 12 (f/1.8 ) + 12 (f/2.8) Mpx ',
            image_urls: ['https://www.datart.sk/foto/500/1/7/6/product_4777671.jpg', 'https://www.datart.sk/foto/ilustrace/250/1/8/1/product_4751181.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/4/2/product_4751245.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/0/3/product_4751309.jpg'],
            png_image: 'https://assets.swappie.com/swappie-product-iphone-13-pro-max-sierra-blue-back.png',
        },
        {
            id: 2,
            category: 0,
            title: 'Samsung Galaxy S21',
            version: 'Ultra 5G',
            price: 1249.99,
            discount_bollean: false,
            producer: 'Samsung',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#000'
                },
                {
                    title: 'Biela',
                    hex: '#f8f8ff'
                },
                {
                    title: 'Zelen??',
                    hex: '#2E8B57'
                },
                {
                    title: 'Zlatoru??ov??',
                    hex: '#F2D1CB'
                }
            ],
            description_title: 'Ultra smartf??n pre ultra z????itky',
            description: 'smartf??n ??? 6,8" uhloprie??ka ??? displej Dynamic AMOLED 2X ??? 3200 ?? 1440 Quad HD+ (515 PPI) ??? procesor Exynos 2100 (8-jadrov??) ??? pam???? RAM 12 GB ??? intern?? pam???? 128 GB ??? zadn?? fotoapar??t so 4 objekt??vmi: 108 (f/1,8) + 12 (f/2,2) + 10 (f/2,4) + 10 (f/4,9) Mpx ??? predn?? fotoapar??t 40 Mpx (f/2,2) ??? sn??ma?? odtla??ku prstov ??? Bluetooth ??? NFC ??? 5G ??? GPS ??? Wi-Fi ??? USB-C ??? OTG ??? kapacita bat??rie 5 000 mAh ??? bezdr??tov?? nab??janie (15 W) ??? r??chlonab??janie (25 W)',
            short_description: 'Zozn??mte sa s telef??nom, ktor?? prin????a revol??ciu hne?? v nieko??k??ch aspektoch. Samsung Galaxy S21 Ultra 5G v sebe sp??ja pokro??il?? mobiln?? technol??gie vr??tane ????asne pevn??ho skla na brilantnom displeji, jedine??n??ho spracovania zadn??ho fotoapar??tu a mo??nosti tvorby vide?? v 8K rozl????en??.',
            image_urls: ['https://www.datart.sk/foto/500/1/0/9/product_4438901.jpg', 'https://www.datart.sk/foto/ilustrace/250/3/0/9/product_4438903.jpg', 'https://www.datart.sk/foto/ilustrace/250/5/0/9/product_4438905.jpg', 'https://www.datart.sk/foto/ilustrace/250/7/0/9/product_4438907.jpg', 'https://www.datart.sk/foto/ilustrace/250/2/7/9/product_4438972.jpg'],
            png_image: 'https://images.samsung.com/sk/smartphones/galaxy-s22-ultra/images/galaxy-s22-ultra_jump_models_s.png',
        },
        {
            id: 3,
            category: 0,
            title: 'Huawei P50',
            version: 'Pro',
            price: 1239.99,
            discount_bollean: false,
            producer: 'Huawei',
            availability: 'Posledn?? kusy',
            colors: [{
                    title: '??ierna',
                    hex: '#000'
                },
                {
                    title: 'Zlat??',
                    hex: '#F1E5AC'
                },
                {
                    title: 'Biela',
                    hex: '#F8f6f0'
                },
                {
                    title: 'Ru??ov??',
                    hex: '#e68fac'
                }
            ],
            description_title: 'Huawei P50 Pro',
            description: 'Legenda je sp????. Smartf??n Huawei P50 Pro pote???? aj n??ro??n??ch u????vate??ov svojim v??konom, kvalitou displeja a perfektn??m fotoapar??tom. Dominantou pr??stroja je 6,6" OLED displej s vysok??m rozl????en??m, kde ka??d?? detail vynikne ostro a v ??iv??ch farb??ch. Do 256 GB pam??te m????ete ulo??i?? v??etky svoje aplik??cie, hudbu, fotky aj vide??. Na ich obstaranie posl????i ??pi??kov?? ??tvorn??sobn?? zadn?? fotoapar??t s rozl????en??m 50 + 40 + 13 + 64 Mpx, alebo m????ete vyu??i?? predn?? 13 Mpx kameru.',
            short_description: 'smartf??n ??? 6,6" uhloprie??ka ??? OLED displej ??? 2700 ?? 1228 px ??? obnovovacia frekvencia 120 Hz ??? procesor Qualcomm Snapdragon 888 (8jadrov?? ??? a?? 2,84 GHz) ??? pam???? RAM 8 GB ??? intern?? pam???? 256 GB',
            image_urls: ['https://www.datart.sk/foto/500/2/4/3/product_4911342.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/4/3/product_4911344.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/4/3/product_4911346.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/5/3/product_4911350.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/5/3/product_4911358.jpg'],
            png_image: 'https://images.samsung.com/sk/smartphones/galaxy-s22-ultra/images/galaxy-s22-ultra_jump_models_s.png',
        },
        {
            id: 4,
            category: 0,
            title: 'Nokia',
            version: 'X20 5G',
            price: 373.00,
            discount_bollean: true,
            discount_price: 348.90,
            producer: 'Nokia',
            availability: 'Na sklade',
            colors: [{
                    title: 'Modr??',
                    hex: '#203D7E'
                },
                {
                    title: 'Oran??ov??',
                    hex: '#D98566'
                }
            ],
            description_title: 'Nokia X20 5G',
            description: 'Inteligentn?? mobiln?? telef??n Nokia X20 5G (101QKSLVH041) udr???? krok s va????m vysok??m pracovn??m nasaden??m a vo chv????kach oddychu sa stane va????m nenahradite??n??m spolo??n??kom. Jedn?? sa toti?? o modern?? pr??stroj so spo??ahliv??m v??konom, ve??k??m Full HD+ displejom a skvel??m ??tvorn??sobn??m fotoapar??tom, ktor?? si proste mus??te zamilova??. Ocen??te na ??om aj ve??a drobn??ch vychyt??vok, ktor??m dominuje podpora vysokor??chlostn??ho 5G internetu, technol??gia NFC pre pohodln?? platby mobilom ??i mo??nos?? zabezpe??enia pomocou tv??re aj odtla??kov prstov. Tento smartf??n m?? skuto??ne ??o pon??knu??.',
            short_description: 'smartf??n ??? 6,67" uhloprie??ka ??? Full HD+ LCD displej ??? 2400 ?? 1080 px ??? obnovovacia frekvencia 60 Hz ??? procesor Qualcomm (8-jadrov?? ?????? a?? 2 GHz) ??? pam???? RAM 6 GB ??? intern?? pam???? 128 GB',
            image_urls: ['https://www.datart.sk/foto/500/1/5/0/product_4619051.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/5/0/product_4619053.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/5/0/product_4619055.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/5/0/product_4619057.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/5/0/product_4619059.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/6/0/product_4619061.jpg'],
            png_image: '',
        },
        {
            id: 5,
            category: 0,
            title: 'Xiaomi Redmi',
            version: 'Note 11',
            price: 339.00,
            discount_bollean: false,
            producer: 'Xiaomi',
            availability: 'Na sklade',
            colors: [{
                    title: 'Siv??',
                    hex: '#4f555b'
                },
                {
                    title: 'Modr??',
                    hex: '#375597'
                }
            ],
            description_title: 'Xiaomi Redmi Note 11 4 GB/128 GB',
            description: 'Xiaomi Redmi Note 11 je vynikaj??co vybaven?? smartf??n s p??sobiv??m 50 Mpx fotoapar??tom aj v??born??m v??konom, ktor?? dod??va modern?? Snapdragon 680. Z??ska si v??s ale aj kr??snym displejom s 6,43 palcami, AMOLED technol??giou a 90 Hz obnovovacou frekvenciou. Par??dny je aj poh??ad na bat??riu. T?? vzh??adom na kapacitu 5 000 mAh s??ubuje dlh?? v??dr?? a ocen??te aj jej r??chle nab??janie s v??konom 33 W. Mysl?? ale aj na zabezpe??enie, vi?? ????ta??ka odtla??ku prstov, a prin????a v??etky modern?? mo??nosti vr??tane bezkontaktn??ho platenia s NFC, zv????enej odolnosti IP53, ??i modern??ho USB-C a podpory Dual SIM.',
            short_description: 'smartf??n??? 6,43" uhloprie??ka ??? AMOLED displej ??? 2400 ?? 1080 px ??? obnovovacia frekvencia 90 Hz ??? procesor Qualcomm Snapdragon 680 (8-jadrov?? ??? a?? 2,4 GHz) ??? pam???? RAM 4 GB ??? intern?? pam???? 128 GB ??? zadn?? fotoapar??t 50 (f/1.8) + 8 (f/2.2) + 2 (f/2.4) + 2 (f/2.4) Mpx ??? predn?? fotoapar??t 13 Mpx (f/2.4) ??? dual SIM ??? NFC ??? Bluetooth ??? LTE ??? GPS ??? Wi-Fi ??? USB-C ??? 3,5 mm jack ??? zv????en?? odolnos?? s certifik??ciou IP53 ??? odomykanie pomocou odtla??ku prstov ??? Android 11 ??? kapacita bat??rie 5 000 mAh ??? r??chlonab??janie 33 W',
            image_urls: ['https://www.datart.sk/foto/800/6/6/4/product_4904466.jpg', 'https://img.aktuality.sk/foto/redmi-note-11/Zml0LWluLzEzMjB4MC9maWx0ZXJzOmZvcm1hdChqcGcpL2h0dHA6Ly9sb2NhbGhvc3Q6ODEvcHVsc2Ntcy10cmFuc2Zvcm1zLzE=/nyOktkpTURBXy8yMzgyNmI4NDk0M2FhYTc4YTVmMDA5YjRmMWE4YzU2Zi5qcGeRlQLNB9AAwsM?st=2swxJnfh6irCs_FSFqVnYQqK8e5pX-8A0k9pQG2t0RY&ts=1647126000&e=0', 'https://imgs.sector.sk/files/novinky/0/2022/1-26-15-11-68//xiaomi-redmi-note-11-pro-269005-1893513.jpg'],
            png_image: '',
        },
        {
            id: 6,
            category: 0,
            title: 'Realme 9',
            version: 'Pro',
            price: 302.38,
            discount_bollean: true,
            discount_price: 278.30,
            producer: 'Realme',
            availability: 'Posledn?? kusy',
            colors: [{
                    title: '??ierna',
                    hex: '#393a3f'
                },
                {
                    title: 'Zelen??',
                    hex: '#2E8B57'
                },
                {
                    title: 'Modr??',
                    hex: '#375597'
                }
            ],
            description_title: 'Realme 9 Pro',
            description: 'Realme 9 Pro je smartf??n pre n??ro??n??ch, ktor?? m?? naozaj ??o pon??knu??. Pozornos?? si okam??ite z??ska nielen kr??sne tenk??m dizajnom, ale aj 6,6-palcov??m IPS displejom s p??sobivou 120 Hz obnovovacou frekvenciou. Nepo??avuje ale ani v ??al????ch z??sadn??ch vlastnostiach, naopak, exceluje 64 Mpx fotoapar??tom, tak??e sa m????ete te??i?? na n??dhern?? fotografie za ak??chko??vek podmienok. Na pozit??vnej vlne sa vezie aj 5 000 mAh bat??ria s bezprobl??movou celodennou v??dr??ou a superr??chle nab??janie v??konom 30 W! Praktick?? je ????ta??ka odtla??kov prstov na boku! Garanciou superr??chlych reakci?? je zase osemjadrov?? procesor Qualcomm Snapdragon 695 5G podporen?? dynamickou RAM. Te??i?? sa ale m????ete aj na vyladen?? zvuk, NFC, 5G, Dual SIM a ??al??ie praktick?? prvky, ktor?? v??m v??razne u??ah??ia ??ivot.',
            short_description: 'smartf??n ??? 6,6" uhloprie??ka ??? IPS displej ??? 2412 ?? 1080 px ??? obnovovacia frekvencia 120 Hz ??? procesor Qualcomm Snapdragon 695 5G (8-jadrov?? ??? a?? 2,2 GHz) ??? pam???? RAM 6 GB ??? intern?? pam???? 128 GB ??? trojn??sobn?? zadn?? fotoapar??t 64 (f/1.79) + 8 (f/2.2) + 2 (f/2.4) ??? predn?? fotoapar??t 16 Mpx (f/2.05) ??? dual SIM ??? NFC ??? Bluetooth 5.1 ??? 5G ??? GPS, GLONASS, BeiDou ??? Wi-Fi ??? USB-C ??? 3,5 mm jack ??? odomykanie pomocou tv??re a odtla??kov prstov ??? Android 12 ??? kapacita bat??rie 5 000 mAh ??? r??chlonab??janie 33 W',
            image_urls: ['https://www.datart.sk/foto/800/5/0/2/product_4910205.jpg', 'https://im9.cz/sk/iR/importprodukt-orig/773/7739009c5594933f7a5b2249ef52e7fd--mmf350x350.jpg'],
            png_image: '',
        },
        {
            id: 7,
            category: 0,
            title: 'Honor 50',
            version: '5G',
            price: 587.00,
            discount_bollean: true,
            discount_price: 467.90,
            producer: 'Honor',
            availability: 'Na sklade',
            colors: [{
                    title: 'Svetlomodr??',
                    hex: '#F0FFFF'
                },
                {
                    title: '??iern??',
                    hex: '#393a3f'
                }
            ],
            description_title: 'Honor 50 5G',
            description: 'Smartf??n Honor 50 5G je perfektnou vo??bou pre t??ch, ktor?? po??aduj?? kr??sny displej, luxusn?? fotoapar??ty aj r??chle nab??janie alebo dlh?? v??dr??. To v??etko dok????e tento elegantn?? telef??n pon??knu?? ??? vr??tane opera??n??ho syst??mu Android 11 so v??etk??mi jeho mo??nos??ami. Honor 50 sa m????e te??i?? z opera??n??ho syst??mu Android 11 s plnou podporou Google slu??ieb. To znamen??, ??e umo????uje naplno vyu????va?? v??etky slu??by od Googlu ako u ostatn??ch zna??iek. Prostredie navy??e ale vylep??uje nadstavbou Magic UI 4.2, ktor?? vyla??uje dizajn a prin????a aj novinky.',
            short_description: 'smartf??n ??? 6,57" uhloprie??ka ??? OLED displej ??? 2340 ?? 1080 px ??? obnovovacia frekvencia 120 Hz ??? procesor Qualcomm Snapdragon 778G (8-jadrov?? ??? a?? 2,4 GHz) ??? pam???? RAM 8 GB ??? intern?? pam???? 256 GB ??? zadn?? fotoapar??t 108 (f/1.9) + 8 (f/2.2) + 2 (f/2.4) + 2 (f/2.4) Mpx ??? predn?? fotoapar??t 32 Mpx (f/2.2) ??? dual SIM ??? NFC ??? Bluetooth ??? 5G ??? GPS ??? Wi-Fi ??? USB-C ??? odomykanie pomocou odtla??ku prstov ??? Android 11 ??? kapacita bat??rie 4 300 mAh ??? r??chlonab??janie 66 W',
            image_urls: ['https://www.datart.sk/foto/800/9/5/0/product_4871059.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/1/5/product_4777511.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/1/5/product_4777517.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/2/5/product_4777523.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/2/5/product_4777525.jpg'],
            png_image: '',
        },
        {
            id: 8,
            category: 0,
            title: 'Samsung Galaxy Z',
            version: 'Flip3 5G',
            price: 1099.00,
            discount_bollean: false,
            producer: 'Samsung',
            availability: 'Vypredan??',
            colors: [{
                title: '??ierna',
                hex: '#393a3f'
            }],
            description_title: 'Samsung Galaxy Z Flip3 5G',
            description: 'Samsung Galaxy Z Flip3 5G si berie to najlep??ie zo svojho ??spe??n??ho predchodcu a vylep??uje, ??o sa d??. Pon??ka tak ??pi??kov?? hardv??r v podobe Snapdragon 888 s podporou 5G, ale jeho hlavn?? v??hoda je predsa len inde: ide o revolu??n?? flipov?? dizajn, v??aka ktor??mu sa v??m telef??n s obrovsk??m 6,7" Full HD+ Super AMOLED displejom a 120 Hz ??ahko vojde aj do skuto??ne mal??ho vrecka! Medzi ??pi??ku sa rad?? aj vo fotografovan?? a nat????an?? vide??. M?? tie?? ????ta??ku odtla??ku prstov prakticky na boku, obrovsk?? pam???? (256/8 GB) alebo dlh?? v??dr?? z??sluhou 3 300 mAh bat??rie.',
            short_description: 'smartf??n ??? 6,7" uhloprie??ka ??? Super AMOLED displej ??? 2640 ?? 1080 px ??? obnovovacia frekvencia 120 Hz ??? procesor Snapdragon 888 (8-jadrov?? ??? a?? 2,84 GHz) ??? pam???? RAM 8 GB ??? intern?? pam???? 256 GB ??? dvojit?? zadn?? fotoapar??t 12 (f/1,8) + 12 (f/2,2) Mpx ??? optick?? stabiliz??cia ??? predn?? fotoapar??t 10 Mpx (f/2,4) ??? NFC ??? Bluetooth ??? 5G ??? GPS ??? Wi-Fi ??? USB-C ??? odomykanie pomocou odtla??ku prstov ??? Android 11 ??? kapacita bat??rie 3 300 mAh',
            image_urls: ['https://www.datart.sk/foto/800/1/2/2/product_4696221.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/2/2/product_4696223.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/2/2/product_4696225.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/2/2/product_4696227.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/2/2/product_4696229.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/3/2/product_4696237.jpg'],
            png_image: '',
        },
        {
            id: 9,
            category: 0,
            title: 'Vivo',
            version: 'Y20s',
            price: 169.00,
            discount_bollean: false,
            producer: 'Nokia',
            availability: 'Posledn?? kusy',
            colors: [{
                title: '??ierna',
                hex: '#393a3f'
            }],
            description_title: 'Vivo Y20s',
            description: 'Vivo Y20s je kr??snou uk????kou toho, ??e aj za priazniv?? cenu mo??no pon??knu?? zauj??mav?? v??bavu a skvele funguj??ci inteligentn?? telef??n. Spo??ahliv?? chod syst??mu Android toti?? v jeho pr??pade zabezpe??uje preveren?? procesor Snapdragon 460 doplnen?? o 4 GB RAM a hlavne skuto??ne ve??korys?? priestor pre d??ta s kapacitou 128 GB. Nijako nie je ochudobnen?? ani v ot??zke kvality displeja, ke?? pon??kne ve??k?? 6,51-palcov?? panel s HD+ rozl????en??m a ob????benou technol??giou IPS pre vynikaj??cu ??itate??nos?? a skvel?? pozorovacie uhly. Zaujme potom dlhou v??dr??ou, ktor?? prin????a bat??ria s kapacitou 5 000 mAh, alebo ????ta??kou odtla??ku prstov ??ikovne umiestnenou na boku. Na zadnej strane pon??ka hne?? tri fotoapar??ty a o pozornos?? si ??iada aj hodnotn??m dizajnom ??? pos????te sami.',
            short_description: 'smartphone ??? 6,51" uhloprie??ka ??? IPS displej ??? 1600 ?? 720 px ??? obnovovacia frekvencia 60 Hz ??? procesor Snapdragon 460 (8-jadrov?? - a?? 1,8 GHz) ??? pam???? RAM 4 GB ??? intern?? pam???? 128 GB ??? trojit?? zadn?? fotoapar??t 13 (f/2,2) + 2 (f/2,4) + 2 (f/2,4) Mpx ??? predn?? fotoapar??t 8 Mpx (f/1,8) ??? Dual SIM ??? Bluetooth ??? LTE ??? GPS ??? Wi-Fi ??? micro USB ??? 3,5 mm Jack ??? zv????en?? odolnos?? s certifik??ciou IPX2 ??? odomykanie pomocou tv??re a odtla??kov prstov ??? Android 10.0 ??? kapacita bat??rie 5000 mAh ??? r??chlonab??janie 18 W',
            image_urls: ['https://www.datart.sk/foto/800/0/2/5/product_4467520.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/2/5/product_4467524.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/2/5/product_4467526.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/5/6/product_4467653.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/2/5/product_4467528.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/3/5/product_4467530.jpg'],
            png_image: '',
        },
        {
            id: 10,
            category: 1,
            title: 'Samsung Galaxy',
            version: 'Watch4 Classic',
            price: 369.00,
            discount_bollean: true,
            discount_price: 312.98,
            producer: 'Samsung',
            availability: 'Posledn?? kusy',
            colors: [{
                    title: 'Strieborn??',
                    hex: '#D3D3D3'
                },
                {
                    title: '??ierna',
                    hex: '#2e1c11'
                },
                {
                    title: 'Zelen??',
                    hex: '#7a9274'
                },
                {
                    title: 'Zlatoru??ov??',
                    hex: '#E6C7C2'
                },
                {
                    title: 'Biela',
                    hex: '#fff'
                }
            ],
            description_title: 'Samsung Galaxy Watch4 Classic 42 mm',
            description: 'Samsung si tento rok prichystal pre Watch4 poriadnu medzigenera??n?? zmenu. Nielen??e vylep??il v??bavu, ako sa o??ak??va ka??d?? rok, ale tie?? vymenil syst??m. Namiesto tradi??n??ho Tizen tak ve??a noviniek a oce??ovan?? funkcie prin????a Wear OS Powered by Samsung. M????ete sa te??i?? aj na 1,2" Super AMOLED displej s kryt??m Corning Gorilla Glass DX alebo bohat?? senzorov?? v??bavu. Hodinky nielen??e maj?? optick?? sn??ma?? srdcov??ho tepu, ale meraj?? aj EKG a krvn?? tlak, rovnako ako okysli??enie krvi a disponuj?? aj senzorom bioelektrickej impedancie na meranie zlo??enia tela (BIA). (Meranie EKG a krvn??ho tlaku vy??aduje smartf??n Galaxy so syst??mom Android 7.0 alebo nov????m). Rovnako nekompromisne si ale ved?? aj v oblasti konektivity s GPS, NFC, Wi-Fi aj Bluetooth 5.0 a zaujm?? tie?? ve??mi slu??nou v??dr??ou 40 hod??n! Na ich ovl??danie pritom vyu??ijete okrem dotykov??ho displeja tie?? dve tla??idl?? a digit??lnu lunetu. Pote??ia ale aj mikrof??nom a reproduktorom na  hovory.',
            short_description: 'Obrovskou novinkou je u Watch4 zmena syst??mu. Miesto Tizen, ktor?? pou????vali predchodcovia, teraz prin????a e??te viac funkci?? a vyspelej???? u????vate??sk?? z????itok s Wear OS navrhnut??m v spolupr??ci Samsungu a Googlu.',
            image_urls: ['https://www.datart.sk/foto/500/1/9/8/product_4696891.jpg', 'https://najlepsiemobily.sk/wp-content/uploads/2021/09/Samsung-Galaxy-Watch4-Classic-46mm-SM-R890-Silver2.jpg', 'https://digitall.sk/media/catalog/product/cache/1/thumbnail/500x500/9df78eab33525d08d6e5fb8d27136e95/s/m/sm-r860_002_front2_silver-web.jpg', 'https://i.cdn.nrholding.net/72760126/1000/1000'],
            png_image: 'https://images.samsung.com/is/image/samsung/p6pim/sk/2108/gallery/sk-galaxy-watch4-sm-r870nzsaeue-481789753?$720_576_PNG$'
        },
        {
            id: 11,
            category: 1,
            title: 'Amazfit',
            version: 'GTS 2 mini',
            price: 97.00,
            discount_bollean: true,
            discount_price: 79.90,
            producer: 'Amazfit',
            availability: 'Dostupn?? od 28.2.2022',
            colors: [{
                    title: '??ierna',
                    hex: '#00040D'
                },
                {
                    title: 'Zlat??',
                    hex: '#dfb976'
                },
                {
                    title: '??ed??',
                    hex: '#92969a'
                }
            ],
            description_title: 'Amazfit GTS 2 mini',
            description: 'Smart hodinky Amazfit GTS 2 mini zaujm?? p??sobivou v??bavou v kombin??cii s kompaktn??m vyhotoven??m, v??aka ktor??mu perfektne padn?? na ruku. V??etko d??le??it?? pritom zobrazuj?? prostredn??ctvom 1,55-palcov??ho Retina Always-on AMOLED displeja, vr??tane d??t nameran??ch prostredn??ctvom integrovanej GPS, ktor?? ocen??te napr??klad pri behu. Rovnako tak v??ak podporuj?? aj meranie pokro??il??ch metr??k, ako je okysli??enie krvi alebo stres. S t??m sa v??m pom????u vyrovna?? pomocou dychov??ch cvi??en??. Hodinky s?? vodotesn?? pod??a 50 m (5 ATM) a pon??kaj?? celkovo vy??e 70 ??portov??ch re??imov. Exceluj?? pritom aj v ot??zke v??dr??e na nabitie, ktor?? predstavuje a?? 14 dn??! Rovnako tak presne monitoruj?? sp??nok a posl????ia k vzdialen??mu ovl??daniu v????ho telef??nu.',
            short_description: 'smart hodinky ??? 1,55" Always-on AMOLED displej ??? dotykov??/tla??idlov?? ovl??danie ??? Bluetooth 5.0 ??? GPS, GLONASS ??? kompas ??? akcelerometer ??? gyroskop ??? senzor okolit??ho osvetlenia ??? senzor srdcov??ho tepu ??? v??po??et sp??len??ch kal??ri?? ??? krokomer + meranie vzdialenosti a r??chlosti ',
            image_urls: ['https://www.datart.sk/foto/500/0/3/7/product_4449730.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/3/7/product_4449732.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/3/7/product_4449736.jpg'],
            png_image: ''
        },
        {
            id: 12,
            category: 1,
            title: 'Apple Watch',
            version: 'Series 7 GPS',
            price: 429.00,
            discount_bollean: false,
            producer: 'Apple',
            availability: 'Na sklade',
            colors: [{
                    title: 'Svetlozlat??',
                    hex: '#F6F6DC'
                },
                {
                    title: '??ierna',
                    hex: '#00040D'
                },
                {
                    title: 'Zelen??',
                    hex: '#013225'
                },
                {
                    title: 'Modr??',
                    hex: '#7393B3'
                },
                {
                    title: '??erven??',
                    hex: '#C0392B'
                }
            ],
            description_title: 'Roz??iruj?? obzory',
            description: 'Smart hodinky s ovl??dan??m v sloven??ine, GPS, meranie tepu, telefonovanie z hodiniek cez sp??rovan?? telef??n (v dosahu Bluetooth), NFC platby cez Apple Pay, meranie EKG, monitoring sp??nku, krokomer, oxymeter, barometer, vhodn?? na aktivity: beh, cyklistika, joga, pl??vanie, vodotesnos?? 50 m (5 ATM), detekcia p??du, materi??l puzdra: hlin??k',
            short_description: 'V???????? displej. Odolnej??ia kon??trukcia. R??chlej??ie nab??janie. A vyspel?? funkcie, ako s?? napr??klad Satur??cia kysl??kom a EKG. Pozdrav svoje zdrav??ie ja.',
            image_urls: ['https://www.datart.sk/foto/500/9/7/0/product_4778079.jpg'],
            png_image: ''
        },
        {
            id: 13,
            category: 1,
            title: 'Niceboy X-fit Watch',
            version: '2 Lite',
            price: 40.00,
            discount_bollean: true,
            discount_price: 35.70,
            producer: 'Niceboy',
            availability: 'Posledn?? kusy',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Niceboy X-fit Watch 2 Lite',
            description: 'Niceboy X-fit Watch 2 Lite s?? ??t??lov?? inteligentn?? hodinky s 1,69" displejom, ktor?? v??m poskytn?? dokonal?? preh??ad o va??ej kond??cii a zdrav??. Sleduj?? toti?? nielen srdcov?? tep, ale aj krvn?? tlak, okysli??enie krvi a regener??ciu v podobe sp??nku. K dispoz??cii maj?? hne?? 7 re??imov ??portu a ich ve??k?? v??hodu predstavuje aj dlh?? v??dr?? na nabitie predstavuj??ca a?? 7 dn??!',
            short_description: 'inteligentn?? hodinky ??? 1,69" displej ??? dotykov??/tla??idlov?? ovl??danie ??? Bluetooth 5.0 ??? senzor srdcov??ho tepu ??? meranie okysli??enia krvi ??? v??po??et sp??len??ch kal??ri?? ??? krokomer + meranie vzdialenosti a r??chlosti ??? sp??nok ??? notifik??cia ??? v??dr?? a?? 7 dn?? ??? beh ??? cyklistika ??? turistika ??? vodoodolnos?? pod??a IP67 ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/500/1/7/8/product_4674871.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/5/1/product_4726150.jpg'],
            png_image: ''
        },
        {
            id: 14,
            category: 1,
            title: 'Amazfit GTR',
            version: '3 Pro',
            price: 197.90,
            discount_bollean: true,
            discount_price: 188.90,
            producer: 'Amazfit',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Amazfit GTR 3 Pro, ??ierna',
            description: 'Udr??ujte sa v kond??cii. Zadov????te si ??portov?? hodinky Amazfit GTR 3 Pro, ktor?? v??m bud?? ka??d?? de?? suplova?? funkciu osobn??ho tr??nera. Zmeraj?? v??m celodenn?? aktivitu vr??tane krokov, kal??ri??, vzdialenos??, srdcov?? tep, kvalitu sp??nku, stres i okysli??enie krvi. ??eny m????u vyu??i?? preh??adn?? rozhranie na zaznamen??vanie men??trua??n??ho cyklu.<br>Hodinky maj?? v sebe zabudovan?? 4 GB pam????, ktor?? mo??no pou??i?? na ulo??enie a po????vanie hudobn??ch skladieb po??as cvi??enia. Telef??n nechajte doma, v??aka vstavan??mu reproduktoru budete m??c?? hudbu po????va?? priamo z hodiniek. Okrem cvi??enia v posil??ovni alebo vonkaj??iemu behu sa ich nemus??te b???? vzia?? tie?? do vody. S?? vodotesn?? pod??a 50 m (5 ATM) , skvele sa preto hodia aj na pl??vanie.',
            short_description: 'inteligentn?? hodinky ??? 1,45" AMOLED displej ??? dotykov?? + tla??idlov?? ovl??danie ??? Bluetooth 5.0 ??? Wi-Fi ??? GPS ??? akcelerometer ??? gyroskop ??? senzor srdcov??ho tepu ??? v??po??et sp??len??ch kal??ri?? ??? krokomer + meranie vzdialenosti a r??chlosti ??? sp??nok ??? men??trua??n?? cyklus ??? monitor stresu ??? okysli??enie krvi ??? hudobn?? prehr??va?? (intern?? pam???? 4 GB) ??? notifik??cie ??? ovl??danie telef??nu ??? v??dr?? a?? 30 dn?? ??? vodotesnos?? pod??a 50 m (5 ATM) ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/800/2/6/8/product_4766862.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/6/8/product_4766864.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/6/8/product_4766866.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/6/8/product_4766868.jpg'],
            png_image: ''
        },
        {
            id: 15,
            category: 1,
            title: 'Xiaomi Mi Smart',
            version: 'Band 5',
            price: 59.00,
            discount_bollean: true,
            discount_price: 19.90,
            producer: 'Xiaomi',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#2e1c11'
                },
                {
                    title: '??lt??',
                    hex: '#f2b232'
                },
                {
                    title: 'Modrozelen??',
                    hex: '#304847'
                },
                {
                    title: 'Navy',
                    hex: '#4e3f64'
                },
                {
                    title: 'M??tovozelen??',
                    hex: '#7a9274'
                },
                {
                    title: 'Oran??ov??',
                    hex: '#e85338'
                }
            ],
            description_title: 'Xiaomi Mi Smart Band 5',
            description: 'Udr??ujte svoje telo v kond??cii. Fitness n??ramok Xiaomi Mi Smart Band 5 v??m posl????i spo??ahlivej??ie ne?? osobn?? tr??ner. Str????i v??s 24 hod??n denne, sleduje po??et krokov, kal??rie, ale aj v???? srdcov?? tep, alebo kvalitu sp??nku. M?? kompaktn?? rozmery a na z??p??st?? p??sob?? elegantne a vkusne, ??i u?? ho m??te nasaden?? v posil??ovni, alebo v pr??ci. Vyberte si z ponuky 11 ??portov??ch re??imov pre e??te presnej??ie v??sledky va??ej aer??bnej aktivity. Integrovan?? bat??ria zaist?? n??ramku a?? 14 dn?? prev??dzky na jedno nabitie. Kedyko??vek potrebujete, sta???? ho pripoji?? k dod??vanej magnetickej nab??ja??ke, aby ste n??ramku ihne?? dodali energiu a mohli ho ??alej bez obmedzenia pou????va??.',
            short_description: 'fitness n??ramok ??? 1,1" AMOLED displej ??? dotykov?? ovl??danie ??? Bluetooth 5.0 ??? akcelerometer ??? gyroskop ??? krokomer ??? senzor srdcov??ho tepu ??? sp??len?? kal??rie ??? sledovanie men??trua??n??ho cyklu ??? sp??nok ??? meranie r??chlosti ??? meranie vzdialenosti ??? notifik??cia ??? ovl??danie telef??nu ??? beh ??? turistika ??? cyklistika ??? fitness ??? outdoor ??? joga ??? pl??vanie ??? v??dr?? a?? 14 dn?? ??? vodotesnos?? pod??a 50 m (5 ATM) ??? ??esk?? jazyk ??? materi??l puzdra: polykarbon??t, materi??l remienka: silik??n ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/800/6/9/6/product_4253696.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/9/6/product_4253698.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/0/7/product_4253700.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/0/7/product_4253702.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/0/7/product_4253704.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/1/7/product_4253715.jpg'],
            png_image: ''
        },
        {
            id: 16,
            category: 1,
            title: 'Huawei',
            version: 'Band 6',
            price: 59.90,
            discount_bollean: true,
            discount_price: 39.90,
            producer: 'Huawei',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#020202'
                },
                {
                    title: 'Zelen??',
                    hex: '#526a6c'
                },
                {
                    title: 'Ru??ov??',
                    hex: '#f2e3e4'
                },
                {
                    title: 'Oran??ov??',
                    hex: '#f6886e'
                }
            ],
            description_title: 'Huawei Band 6',
            description: 'S n??ramkom Huawei Band 6 z??skate skvel?? preh??ad o va??ich ??portov??ch v??konoch, sp??nku i zdrav?? v??eobecne. Inform??cie serv??ruje cez 1,47" AMOLED displej, na ktorom si m????ete zvoli?? vlastn?? cifern??k. Dok????e mera?? nielen srdcov?? tepov?? frekvenciu, ale tie?? pon??ka SpO2 monitor, aby ste e??te lep??ie porozumeli v????mu telu. Oproti inteligentn??m hodink??m vynik?? aj v??dr??ou na nabitie a?? 14 dn??, rovnako tak si pozornos?? vy??aduje hne?? 96 ??portov??ch re??imov. Napriek tomu zvl??dne aj prij??ma?? notifik??cie z mobilu a prin????a ??al??ie u??ito??n?? funkcie, ako je napr??klad vyh??adanie straten??ho mobilu alebo vzdialen?? ovl??danie fotoapar??tu.',
            short_description: 'fitness n??ramok ??? 1,47" AMOLED displej ??? tla??idlov??/dotykov?? ovl??danie ??? Bluetooth ??? akcelerometer ??? gyroskop ??? krokomer ??? senzor srdcov??ho tepu ??? sp??len?? kal??rie ??? sp??nok ??? meranie vzdialenosti ??? SpO2 monitor ??? notifik??cia ??? ovl??danie telef??nu ??? predpove?? po??asia ??? pl??vanie ??? cyklistika ??? beh ??? outdoor ??? fitness ??? turistika ??? v??dr?? a?? 14 dn?? ??? vodotesnos?? pod??a 50 m (5 ATM) ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/800/1/5/8/product_4549851.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/5/8/product_4549853.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/5/8/product_4549855.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/5/8/product_4549857.jpg'],
            png_image: ''
        },
        {
            id: 17,
            category: 1,
            title: 'Xiaomi Mi',
            version: 'Watch',
            price: 131.90,
            discount_bollean: false,
            producer: 'Xiaomi',
            availability: 'Posledn?? kusy',
            colors: [{
                    title: '??ierna',
                    hex: '#2e1c11'
                },
                {
                    title: 'Strieborn??',
                    hex: '#D3D3D3'
                }
            ],
            description_title: 'Xiaomi Mi Watch',
            description: 'Xiaomi Mi Watch s?? n??dhern?? inteligentn?? hodinky, ktor?? zaujm?? ??t??lov??m 1,39-palcov??m AMOLED displejom, rovnako ako t??m, ??o zvl??dnu. V??aka integrovanej GPS, meraniu tepu i sledovaniu okysli??enia krvi s?? toti?? perfektn??m n??strojom pre ??portovcov a v??eobecne ka??d??ho, komu z??le???? na zdrav??. Celkovo podporuj?? 117 ??portov??ch re??imov a ich ve??kou v??hodou je fakt, ??e na nabitie vydr??ia pracova?? a?? 16 dn??! Skvele spolupracuj?? s telef??nmi vybaven??mi Androidom aj iOS a zaujm?? tie?? vysokou odolnos??ou, aby ste s nimi mohli aj pl??va??. Okrem ??portov??ch aktiv??t pokro??ilo monitoruj?? tie?? kvalitu v????ho sp??nku a pom??haj?? v??m vytv??ra?? lep??ie n??vyky.',
            short_description: 'inteligentn?? hodinky ??? 1,39" AMOLED displej ??? dotykov?? ovl??danie + bo??n?? tla??idl?? ??? Bluetooth 5.0 ??? krokomer ??? senzor srdcov??ho tepu ??? meranie okysli??enia krvi ??? sp??len?? kal??rie ??? sp??nok ??? meranie vzdialenosti ??? notifik??cie ??? ovl??danie telef??nu ??? v??dr?? a?? 16 dn?? ??? vodotesnos?? pod??a 50 m (5 ATM) ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/800/8/4/7/product_4455748.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/5/7/product_4455750.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/5/7/product_4455752.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/5/7/product_4455754.jpg'],
            png_image: ''
        },
        {
            id: 18,
            category: 1,
            title: 'Apple Watch',
            version: 'SE GPS',
            price: 299.00,
            discount_bollean: false,
            producer: 'Apple',
            availability: 'Vypredan??',
            colors: [{
                    title: 'Zelen??',
                    hex: '#64b473'
                },
                {
                    title: '??lt??',
                    hex: '#f0d56c'
                },
                {
                    title: 'Modr??',
                    hex: '#8e9dba'
                },
                {
                    title: 'Tmavomodr??',
                    hex: '#3d4959'
                },
                {
                    title: '??ierna',
                    hex: '#393a3f'
                },
                {
                    title: 'Biela',
                    hex: '#e0dbd5'
                },
                {
                    title: '??erven??',
                    hex: '#c22c45'
                }
            ],
            description_title: 'Na tr??ning i na v??let',
            description: 'S chytr??mi hodinkami Apple Watch SE budete ma?? detailn?? preh??ad o va??om v??kone po??as v??letu alebo tr??ningu. Kr????ky Aktivity funguj?? ako motiv??tor k e??te lep????m ??portov??m v??sledkom. Hodinky monitoruj?? v???? zdravotn?? stav a ved?? v??s k dodr??iavaniu zdrav??ho ??ivotn??ho ??t??lu. Po??as tr??ningu, na v??lete ??i ceste do pr??ce m??te mo??nos?? si zlep??i?? n??ladu po????van??m ob????benej hudby alebo zauj??mav??ch podcastov. D??le??it?? emaily, hovory, bezkontaktn?? platby vyrie??ite pohodlne na z??p??st?? a cestou na sch??dzku sa s integrovan??mi Mapami u?? nikdy nestrat??te. Prisp??sobenie vzh??adu hodiniek v????mu ??t??lu nie je probl??m. Vyberte si z farebn??ch vari??ci?? puzdra, remienkov z m??kk??ho silik??nu ??i pleten??ho ??ahu a neprebern??ho mno??stva vzh??adov cifern??kov vhodn??ch pre ka??d?? pr??le??itos??.',
            short_description: 'inteligentn?? hodinky, GPS, meranie tepu, telefonovanie z hodiniek cez sp??rovan?? telef??n (v dosahu Bluetooth), NFC platby cez Apple Pay, monitoring sp??nku, krokomer, barometer, vhodn?? na aktivity: beh, cyklistika, joga, golf, pl??vanie, vodotesnos?? 50 m (5 ATM), detekcia p??du, materi??l puzdra: hlin??k',
            image_urls: ['https://www.datart.sk/foto/800/3/4/1/product_4767143.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/1/1/product_4767110.jpg'],
            png_image: ''
        },
        {
            id: 19,
            category: 1,
            title: 'Xiaomi Mi',
            version: 'Band 6',
            price: 31.90,
            discount_bollean: true,
            discount_price: 46.00,
            producer: 'Xiaomi',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#2e1c11'
                },
                {
                    title: '??lt??',
                    hex: '#f2b232'
                },
                {
                    title: 'Modrozelen??',
                    hex: '#304847'
                },
                {
                    title: 'Navy',
                    hex: '#4e3f64'
                },
                {
                    title: 'M??tovozelen??',
                    hex: '#7a9274'
                },
                {
                    title: 'Oran??ov??',
                    hex: '#e85338'
                }
            ],
            description_title: 'Xiaomi Mi Band 6',
            description: 'Xiaomi je svetovou jednotkou na trhu s inteligentn??mi n??ramkami a Mi Band 6 ukazuje, pre??o to tak je. Ide toti?? o skvele vybaven?? inteligentn?? n??ramok s kr??snym a ve??k??m AMOLED displejom, v??berom z viac ako 60 cifern??kov a pokro??il??mi ??portovo-zdravotn??mi funkciami. Medzi tie patria ako vysoko presn?? meranie srdcov??ho tepu, tak i sledovanie SpO2 alebo anal??za sp??nku. V reperto??ri m?? 30 fitness re??imov a podporuje aj pl??vanie. Tomu zodpoved?? vodotesnos?? pod??a 50 m (5 ATM) a obrovskou v??hodou je aj v??dr?? na nabitie 14 dn??.',
            short_description: 'fitness n??ramok ??? 1,56" AMOLED displej ??? dotykov?? ovl??danie ??? Bluetooth ??? akcelerometer ??? gyroskop ??? krokomer ??? senzor srdcov??ho tepu ??? sp??len?? kal??rie ??? sp??nok ??? meranie vzdialenosti ??? SpO2 monitor ??? notifik??cia ??? ovl??danie telef??nu ??? predpove?? po??asia ??? pl??vanie ??? cyklistika ??? beh ??? outdoor ??? fitness ??? turistika ??? joga ??? v??dr?? a?? 14 dn?? ??? vodotesnos?? pod??a 50 m (5 ATM) ??? kompatibiln?? s Android/iOS',
            image_urls: ['https://www.datart.sk/foto/800/9/3/2/product_4550239.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/4/2/product_4550241.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/4/2/product_4550243.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/4/2/product_4550245.jpg'],
            png_image: ''
        },
        {
            id: 20,
            category: 2,
            title: 'HP',
            version: '15-dw3601nc',
            price: 919.00,
            discount_bollean: true,
            discount_price: 733.90,
            producer: 'HP',
            availability: 'Na sklade',
            colors: [{
                title: 'Strieborn??',
                hex: '#c0c0c0'
            }],
            description_title: 'HP 15-dw3601nc, strieborn??',
            description: 'Poohliadate sa po notebooku, s ktor??m by ste mohli dennodenne neru??ene pracova??? V tom pr??pade sa zozn??mte s modelom HP 15-dw3601nc (4S1S8EA#BCM). Ide o sympatick?? pr??stroj s Full HD displejom, spo??ahliv??m hardv??rom a v??etkou potrebnou v??bavou, ktor?? v??m skvelo posl????i v kancel??rii, doma aj na cest??ch. Prispeje k tomu aj jeho ??ahk?? a tenk?? dizajn, z??sluhou ktor??ho je tento notebook ve??mi ??ahko prenosite??n??. V neposlednom rade na ??om ocen??te aj pestr?? ponuku praktick??ch vychyt??vok, v ktorej nech??ba podsvieten?? kl??vesnica, HD webkamera ani obojstrann?? rozhranie USB-C. Srdcom tohto po????ta??a je modern?? ??tvorjadrov?? procesor Intel Core i5-1135G7 a z??rukou bezprobl??mov??ho v??konu je aj 16 GB opera??n?? pam???? ??i integrovan?? grafick?? karta Intel Iris Xe Graphics. Ako softv??rov?? z??zemie je tu k dispoz??cii modern?? opera??n?? syst??m Windows 11 Home. Notebook HP 15-dw3601nc je vybaven?? modernou diskovou jednotkou typu SSD, ktor?? m?? hne?? dve v??hody. Jednak vynik?? ??pi??kovou r??chlos??ou, tak??e e??te posil??uje v??kon po????ta??a, a jednak pon??ka ??tedr?? kapacitu na ukladanie d??t - zmest?? sa v??m ich sem a?? 512 GB. ??i u?? triedite fotky, alebo pozer??te film, s t??mto notebookom m??te v??dy zaisten?? perfektn?? obraz. Je tomu tak z??sluhou 15,6-palcov??ho antireflexn??ho displeja s tenu??k??m r??movan??m, ktor?? sa m????e pochv??li?? skvel??m Full HD rozl????en??m (1920 ?? 1080 px).',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? antireflexn?? displej ??? 1920 ?? 1080 px ??? procesor Intel Core i5-1135G7 (4jadrov?? ??? a?? 4,2 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 16 GB ??? zdie??an?? grafick?? karta Intel Iris Xe Graphics ??? HDMI ??? 1?? USB-C ??? 2?? USB 3.0 ??? RJ45 ??? Bluetooth 4.2 ??? Wi-Fi 802.11ac ??? webkamera HP True Vision 720p HD s dvoma integrovan??mi digit??lnymi mikrof??nmi ??? ????ta??ka pam????ov??ch kariet ??? kl??vesnica s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 11 Home',
            image_urls: ['https://www.datart.sk/foto/800/8/9/2/product_4898298.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/1/3/product_4898313.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/0/3/product_4898301.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/0/3/product_4898307.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/0/3/product_4898309.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/1/3/product_4898311.jpg'],
            png_image: ''
        },
        {
            id: 21,
            category: 2,
            title: 'Lenovo Legion',
            version: '5 15IMH05H',
            price: 1299.00,
            discount_bollean: true,
            discount_price: 879.90,
            producer: 'Lenovo',
            availability: 'Posledn?? kusy',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Lenovo Legion 5 15IMH05H, ??ierna',
            description: 'Legion 5 je nefal??ovan?? hern?? notebook, v??aka ktor??mu si u??ijete na maximum najnov??ie tituly. Tie serv??ruje na 15,6-palcovom displeji s Full HD rozl????en??m. Nad??tandardn?? porciu v??konu pritom zais??uje 4-jadrov?? procesor Intel i5-10300H doplnen?? o modern?? grafick?? kartu NVIDIA GeForce RTX 2060 so 6 GB GDDR6 grafickej pam??te. Superr??chle reakcie aj pokro??il?? multitasking zaist?? kooper??cia 16 GB opera??nej pam??te DDR4-3200 a 512GB SSD M.2 2280 PCIe 3.0x4 NVMe. N??ro??n?? hr????i ale bud?? nad??en??m bez seba nielen z obrovsk??ho v??konu, ale aj z prepracovanej kl??vesnice Legion Truestrike s bielym podsvieten??m, rovnako ako z pokro??il??ho syst??mu chladenia Coldfront 2.0 alebo zvuku Harman Kardon. Na skvelej ??rovni je aj konektivita a spo??ahn???? sa m????ete aj na v??dr?? na nabitie dosahuj??cu a?? 8 hod??n!',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? IPS displej ??? 1920 ?? 1080 px ??? procesor Intel i5-10300H (4-jadrov?? ??? a?? 4,5 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 16 GB ??? samostatn?? grafick?? karta NVIDIA GeForce RTX 2060 (6 GB) ??? HDMI ??? 1?? USB-C ??? 4?? USB 3.2 ??? Bluetooth 5.0 ??? Wi-Fi 802.11ax ??? kl??vesnica s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 10 Home',
            image_urls: ['https://www.datart.sk/foto/800/3/8/4/product_4776483.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/8/4/product_4776486.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/8/4/product_4776488.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/9/4/product_4776490.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/9/4/product_4776492.jpg'],
            png_image: ''
        },
        {
            id: 22,
            category: 2,
            title: 'HP Pavilion',
            version: 'Gaming 15-ec2603nc',
            price: 1089.00,
            discount_bollean: false,
            producer: 'HP',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'HP Pavilion Gaming 15, ??ierna',
            description: 'Pavilion Gaming 15 je prenosn?? po????ta?? pre prav??ch hr????ov i kreat??vcov, ktor?? si chc?? ob????ben?? hry u????va?? v??ade a tie?? pracova?? v n??ro??n??ch programoch ??? napr??klad na strih vide?? a fotografi??. Pon??ka v??bavu, ktor?? smelo nahrad?? stoln?? PC, av??ak s v??hodou mobility. Garanciou ??pi??kov??ho v??konu je v jeho pr??pade 6-jadrov?? procesor AMD Ryzen 5 5600H, ktor?? prin????a silu aj pre ve??mi n??ro??n?? ??lohy, ako je strih vide?? a n??ro??n?? ??pravy fotografi??. Zodpoved?? tomu aj ve??k?? 16 GB opera??n?? pam???? a grafick?? karta GeForce RTX 3050 (4 GB), s ktorou m????ete hra?? najnov??ie hry na najvy????ie detaily.  Multim??di?? si vychutn??te na displeji s uhloprie??kou 15,6 palca, ktor?? pon??ka detailn?? Full HD rozl????enie a antireflex??vnu povrchov?? ??pravu, aby bol v??borne ??itate??n?? za v??etk??ch podmienok. Kompromisy samozrejme ne??akajte ani v ??al????ch oblastiach ??? HP premyslelo chladenie, aby sa notebook neprehrieval a vsadilo aj na ??pi??kov?? zvuk Bang & Olufsen, rovnako ako na prepracovan?? portov?? mo??nosti.',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? antireflexn?? displej ??? 1920 ?? 1080 px ??? procesor AMD Ryzen 5 5600H (6-jadrov?? ??? a?? 4,2 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 16 GB ??? samostatn?? grafick?? karta NVID GB) ??? HDMI ??? 1?? USB-C ??? 1?? USB 3.1 ??? 1?? USB 2.0 ??? Bluetooth 5.0 ??? Wi-Fi ac ??? ????ta??ka pam????ov??ch kariet ??? kl??vesnica s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Microsoft Windows 10 Home',
            image_urls: ['https://www.datart.sk/foto/800/4/3/5/product_4774534.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/3/5/product_4774537.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/3/5/product_4774539.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/4/5/product_4774541.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/4/5/product_4774543.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/4/5/product_4774545.jpg'],
            png_image: ''
        },
        {
            id: 23,
            category: 2,
            title: 'Lenovo IdeaPad',
            version: '5 14ITL05',
            price: 1059.90,
            discount_bollean: false,
            producer: 'Lenovo',
            availability: 'Vypredan??',
            colors: [{
                title: 'Siv??',
                hex: '#c0c0c0'
            }],
            description_title: 'Lenovo IdeaPad 5 14ITL05, siv??',
            description: 'IdeaPad 5 od spolo??nosti Lenovo je univerz??lny notebook, ktor?? perfektne posl????i na pr??cu i z??bavu. Pon??ka 14-palcov?? Full HD displej a nad??tandardn?? v??kon i r??chle reakcie, ktor?? obstar??va modern?? procesor Intel Core i5 doplnen?? o bohat?? 16 GB opera??n?? pam???? a tie?? 1 000 GB SSD. Nakopne va??u produktivitu do v????in aj v??aka dlhej v??dr??i na nabitie a?? 11 hod??n alebo prostredn??ctvom bohatej portovej v??bavy a skvelej konektivity. Navy??e kladie d??raz aj na bezpe??ie d??t, tak??e vyu????va ????ta??ku odtla??ku prstov, a pon??ka tie?? fyzick?? kryt webkamery. Pote???? aj kvalitn??m zvukom s reproduktormi Dolby Audio.',
            short_description: 'notebook ??? 14" uhloprie??ka ??? IPS displej ??? 1920 ?? 1080 px ??? procesor Intel Core i5-1135G7 (4-jadrov?? - a?? 4,2 GHz) ??? ??lo??isko SSD 1 000 GB ??? pam???? RAM 16 GB ??? integrovan?? grafick?? karta Intel Iris Xe ??? HDMI ??? 1?? USB-C ??? 2?? USB 3.1 ??? Bluetooth 5.1 ??? Wi-Fi 802.11ax ??? ????ta??ka pam????ov??ch kariet ??? ????ta??ka odtla??ku prstov ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 10 Home',
            image_urls: ['https://www.datart.sk/foto/800/7/4/4/product_4967447.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/2/2/product_4736220.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/4/4/product_4967449.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/5/4/product_4967455.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/6/4/product_4967461.jpg'],
            png_image: ''
        },
        {
            id: 24,
            category: 2,
            title: 'MSI Katana',
            version: 'GF66',
            price: 1185.00,
            discount_bollean: false,
            producer: 'MSI',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'MSI Katana GF66, ??ierna',
            description: 'Pripravte sa zv????azi?? s v??konn??m zariaden??m ostr??m ako ??epe?? katany ??? pustite sa do z????itkov s hern??m notebookom MSI Katana GF66! S podsvietenou kl??vesnicou v??m umo??n?? hra?? aj v noci a zvl??dnu?? v??dy o jeden quest alebo vyhran?? z??pas navy??e. Pokro??il?? hardv??rov?? v??bava zase sprostredkuje dokonal?? pocit z hrania n??ro??n??ch hern??ch titulov. To v??etko s dokonal??m zobrazen??m na pokro??ilom 15,6" Full HD displeji ??rovne IPS s obnovovacou frekvenciou 144 Hz a maxim??lne ??zkymi r??m??ekmi. O to, aby sa v??m notebook ani pri intenz??vnom hran?? zbyto??ne neprehrieval, sa postaraj?? oddelen?? chladiace okruhy pre CPU a GPU a?? s 6 heatpipmi. Rovnako bola pri zostaven?? vyu??it?? aj ??peci??lna teplovodiv?? pasta priamo od v??robcu MSI, aby bol zaisten?? maxim??lny v??kon aj pri hran?? maxim??lne n??ro??n??ch titulov. E??te v??????iu kontrolu nad jednotliv??mi aspektmi v??konu potom z??skate s preh??adn??m rozhran??m MSI Center. Na docielenie optim??lneho v??konu pre ??pi??kov?? hern?? vy??itie je pripraven?? kombin??cia modern??ho 8-jadrov??ho procesora Intel Core i5-11400H s maxim??lnou frekvenciou a?? 4,6 GHz a 16 GB RAM, umo????uj??ca okrem najnov????ch hier spustenie nieko??k??ch aplik??ci?? naraz, medzi ktor?? m????u patri?? rozli??n?? aplik??cie monitoruj??ce v??kon alebo komunika??n?? softv??r typu Discord. Pote???? aj pr??tomnos?? r??chleho SSD NVMe ??lo??iska s kapacitou 512 GB, pracuj??ceho cez rozhranie PCIe 3.0, ktor?? v??s do opera??n??ho syst??mu ??i ob????benej aplik??cie dostane takmer okam??ite. Notebook je navy??e aj v??aka svojmu miniat??rnemu vyhotoveniu ve??mi ??ahk?? a prenosn??, ??o potvrdzuje hmotnos?? iba 2,25 kg. V notebooku je u?? predin??talovan?? opera??n?? syst??m Windows 10 Home, ??o v??m umo??n?? zariadenie hne?? po vybalen?? z krabice za??a?? pou????va??.',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? IPS antireflexn?? displej ??? 1920 ?? 1080 px ??? procesor Intel Core i5-11400H (8-jadrov?? ??? a?? 4,5 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 16 GB ??? samostatn?? grafick?? karta NVIDIA GeForce RTX 3050 Ti (4 GB) ??? HDMI ??? 1?? USB-C ??? 2?? USB 3.2, 1?? USB 2.0 ??? RJ45 ??? Bluetooth 5.2 ??? Wi-Fi 6 (802.11ax) ??? HD webkamera ??? kl??vesnica s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 10 Home',
            image_urls: ['https://www.datart.sk/foto/800/9/4/3/product_4836349.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/6/3/product_4836368.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/5/3/product_4836352.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/5/3/product_4836356.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/5/3/product_4836358.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/6/3/product_4836362.jpg'],
            png_image: ''
        },
        {
            id: 25,
            category: 2,
            title: 'Dell Inspiron 14',
            version: '2in1 Touch',
            price: 845.00,
            discount_bollean: true,
            discount_price: 665.00,
            producer: 'Dell',
            availability: 'Posledn?? kusy',
            colors: [{
                title: 'Siv??',
                hex: '#c0c0c0'
            }],
            description_title: 'Dell Inspiron 14 2in1, siv??',
            description: 'S notebookom Dell Inspiron 14 2in1 (5406) v??m pr??ca p??jde od ruky. Popustite uzdu fant??zii a nechajte sa in??pirova?? n??padit??m dizajnom. Flexibiln?? k??b v??m umo??n?? oto??i?? obrazovku s uhloprie??kou 14 palcov o 180??, aby ste v pr??pade potreby mohli notebook pou????va?? aj ako tablet. To v??m umo??n?? tie?? dotykov?? displej, tak??e sa nebudete musie?? spolieha?? len na kl??vesnicu. O stabiln?? a plynul?? prev??dzku sa postar?? ??tvorjadrov?? procesor Intel Core i5-1135G7 v kombin??cii s 8 GB opera??nou pam????ou. Vn??tri n??jdete r??chle a spo??ahliv?? SSD s kapacitou 256 GB, na ktorom si preh??adne ulo????te v??etky stiahnut?? programy, aplik??cie a s??bory. Na prihl??senie m????ete pou??i?? nielen klasick?? heslo, ale aj odtla??ok prsta.',
            short_description: 'notebook ??? 14" uhloprie??ka ??? dotykov?? displej ??? 1920 ?? 1080 px ??? procesor Intel Core i5-1135G7 (4-jadrov?? ??? a?? 4,2 GHz) ??? ??lo??isko SSD 256 GB ??? pam???? RAM 8 GB ??? zdie??an?? grafick?? karta Intel Iris Xe ??? HDMI ??? 1?? USB-C ??? 2?? USB 3.0 ??? Bluetooth 5.0 ??? Wi-Fi ??? ????ta??ka pam????ov??ch kariet ??? ????ta??ka odtla??ku prstov ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 10 Home ??? Microsoft 365 na 1 rok zadarmo + 1 TB OneDrive cloudov?? ??lo??isko',
            image_urls: ['https://www.datart.sk/foto/800/0/1/5/product_4458510.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/9/6/product_4576692.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/1/5/product_4458512.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/1/5/product_4458516.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/1/5/product_4458518.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/2/5/product_4458522.jpg'],
            png_image: ''
        },
        {
            id: 26,
            category: 2,
            title: 'Asus Zenbook',
            version: '13 OLED',
            price: 789.00,
            discount_bollean: false,
            producer: 'Asus',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Asus Zenbook 13 OLED, siv??',
            description: 'Asus prin????a vynikaj??cu pracovn?? stanicu pre v??etk??ch, ktor?? h??adaj?? v??konn?? a z??rove?? kompaktn?? notebook na cesty. So svojou hmotnos??ou 1,1 kg a rozmermi 30,4 ?? 20,3 ?? 1,4 cm notebook ??ahko uschov??te do akejko??vek ta??ky. Po odklopen?? veka v??s uchv??ti 13,3" OLED panel s excelentn??m farebn??m podan??m, Full HD rozl????en??m (1920 ?? 1080 px) a vysok??m jasom a?? 500 nitov. Kvalitu displeja pod??iarkuje 100 % DCI-P3 a certifik??cia DisplayHDR True Black 500. Displej navy??e s certifik??ciou Pantone Validated garantuje presn?? farebn?? zobrazenie Pantone. Extr??mne tenk?? r??miky v sebe uschov??vaj?? webkameru s HD rozl????en??m a IR kamerou na bezpe??n?? prihlasovanie skenovan??m tv??re pomocou Windows Hello. Srdcom notebooku je 2-jadrov?? procesor Intel Core i3-1115G4 so z??kladnou pracovnou frekvenciou 3 GHz. T?? sa automaticky pretaktov??va v z??vislosti na vy??a??en?? procesora a v re??ime Turbo Boost 2.0 m????e frekvencia vzr??s?? a?? na 4,1 GHz. D??le??it?? je aj pr??tomnos?? technol??gie Hyper-Threading, ktor?? umo????uje ka??d??mu jadru procesora spracov??va?? dve oper??cie naraz, a t??m zvy??ova?? v??kon procesora. Procesoru rob?? spolo??nos?? 8 GB LPDDR4X RAM a r??chle 512 GB SSD, ktor?? je typu M.2 NVMe 3.0 a p????i sa extr??mne r??chlymi prenosov??mi vlastnos??ami v porovnan?? s predch??dzaj??cimi gener??ciami. Pre neust??le pripojenie s okolit??m svetom v??m pr??de vhod Wi-Fi 6 a Bluetooth 5.0. S????as??ou notebooku je predin??talovan?? opera??n?? syst??m Windows 11 Home.',
            short_description: 'notebook ??? 13,3" uhloprie??ka ??? OLED displej ??? 1920 ?? 1080 px ??? procesor Intel Core i3-1115G4 (2-jadrov?? ??? a?? 4,1 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 8 GB ??? zdie??an?? grafick?? karta Intel UHD Graphics ??? HDMI 2.0b ??? Thunderbolt 4 ??? 2?? USB-C ??? 1?? USB 3.0 ??? Bluetooth 5.0 ??? Wi-Fi 802.11ax ??? ????ta??ka pam????ov??ch kariet ??? touchpad s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 11 Home',
            image_urls: ['https://www.datart.sk/foto/800/9/0/5/product_4871509.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/5/5/product_4871552.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/1/5/product_4871512.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/2/5/product_4871520.jpg'],
            png_image: ''
        },
        {
            id: 27,
            category: 2,
            title: 'HP Pavilion',
            version: 'x360 15-er0606nc',
            price: 1099.00,
            discount_bollean: true,
            discount_price: 879.90,
            producer: 'HP',
            availability: 'Na sklade',
            colors: [{
                title: 'Strieborn??',
                hex: '#c0c0c0'
            }],
            description_title: 'HP Pavilion x360 15-er0606nc,, strieborn??',
            description: 'HP Pavilion X360 15-er0606nc je notebook, ktor?? kombinuje vysok?? v??kon a kompaktn?? dizajn vhodn?? na cesty. M?? 15,6" displej s Full HD rozl????en??m, na ktorom uvid??te obraz preh??adne a v s??tych farb??ch. Navy??e sa d?? ovl??da?? aj dotykom, tak??e ho m????ete pou????va?? aj v re??ime tabletu na r??chle a pohodln?? surfovanie po internete. Spo??ahliv?? a r??chle pripojenie kdeko??vek a kedyko??vek v??m zaist?? technol??gia Wi-Fi 6. Pod kl??vesnicou s numerickou ??as??ou je schovan?? procesor Intel Core i5-1135G7 a 16 GB opera??n?? pam????. Svoje s??bory a programy ulo????te na SSD s kapacitou 1 024 GB. Na bo??n??ch stran??ch n??jdete konektory na pripojenie extern??ch zariaden??, medzi ktor??mi nech??ba HDMI, USB-C, USB alebo ????ta??ka kariet.',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? dotykov?? displej ??? 1920 ?? 1080 px ??? procesor Intel Core i5-1135G7 (4-jadrov?? ??? a?? 4,2 GHz) ??? ??lo??isko SSD 1 024 GB ??? pam???? RAM 16 GB ??? zdie??an?? grafick?? karta Intel Iris Xe ??? HDMI ??? 1?? USB-C ??? 2?? USB 3.0 ??? Bluetooth 5.2 ??? Wi-Fi 6 ??? ????ta??ka pam????ov??ch kariet ??? ????ta??ka odtla??ku prstov ??? kl??vesnica s numerickou ??as??ou ??? podsvieten?? kl??vesnica ??? opera??n?? syst??m Windows 10 Home',
            image_urls: ['https://www.datart.sk/foto/800/3/0/5/product_4606503.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/3/5/product_4606530.jpg', 'https://www.datart.sk/foto/ilustrace/800/8/0/5/product_4606508.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/1/5/product_4606516.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/2/5/product_4606520.jpg'],
            png_image: ''
        },
        {
            id: 28,
            category: 2,
            title: 'Apple MacBook',
            version: 'Air 13" M1 256 GB',
            price: 1129.00,
            discount_bollean: false,
            producer: 'Apple',
            availability: 'Posledn?? kusy',
            colors: [{
                title: 'Strieborn??',
                hex: '#c0c0c0'
            }],
            description_title: 'Apple MacBook Air, vesm??rna siv??',
            description: 'Apple MacBook Air je u?? zasl????ene legendou medzi notebookmi a tento rok je v??razne lep????. Zaujme nielen dokonalou prenosnos??ou, kr??snym dizajnom alebo perfektn??m 13,3" Retina displejom, ale najnov??ie aj ove??a vy??????m v??konom, ktor?? prin????a revolu??n?? procesor Apple M1. Te??te sa aj na nov?? slovensko-anglick?? kl??vesnicu Magic Keyboard s podsvieten??m, v??hody syst??mu macOS alebo neuverite??n?? r??chlos?? z??sluhou modern??ho SSD. Vysoko je ale aj konektivita v??aka portom Thunderbolt 3. Garanciou 100 % bezpe??nosti je potom ????ta??ka odtla??ku prstov Touch ID, aby sa k va??im drahocenn??m d??tam nedostal nikto nepovolan??.',
            short_description: 'notebook ??? 13,3" uhloprie??ka ??? Retina displej ??? 2560 ?? 1600 px ??? procesor Apple M1 (8-jadrov?? ??? a?? 3,2 GHz) ??? ??lo??isko SSD 256 GB ??? pam???? RAM 8 GB ??? integrovan?? grafick?? karta ??? 2?? USB 4 (Thunderbolt 3) ??? Bluetooth 5.0 ??? Wi-Fi ax ??? ????ta??ka odtla??ku prstov ??? podsvieten?? slovensko-anglick?? kl??vesnica ??? opera??n?? syst??m macOS Big Sur',
            image_urls: ['https://www.datart.sk/foto/800/1/7/9/product_4381971.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/0/0/product_4382001.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/2/0/product_4382025.jpg'],
            png_image: ''
        },
        {
            id: 29,
            category: 2,
            title: 'Fujitsu LifeBook',
            version: 'A3510',
            price: 479.90,
            discount_bollean: false,
            producer: 'Fujitsu',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Fujitsu LifeBook A3510, ??ierna',
            description: 'Fujitsu LifeBook A3510 je pripraven?? na v??etko, ??o pred neho postav??te. Zaklad?? si na vysoko univerz??lnej v??bave, ktor?? obstoj?? ako doma, tak aj v kancel??rii ??i na cest??ch. Opiera sa nielen o 15,6-palcov?? Full HD displej, ale aj o 10+ hodinov?? v??dr?? na nabitie alebo praktick?? kl??vesnicu s numerickou ??as??ou. V??kon pre ak??ko??vek ??tandardn?? pou??itie a r??chle reakcie zaist?? Intel Core i3-1005G1, 8 GB RAM a 512 GB SSD. V ka??dej situ??cii ale obstoj?? aj v??aka bohatej portovej v??bave ??i HD kamere pre kvalitn?? videohovory. Pritom u?? od zapnutia po????ta?? poh????a modern?? syst??m Windows 10 Pro a aj cez bohat?? v??bavu sa hmotnos?? zariadenia udr??ala pod rozumnou hranicou 2 kg pre ??ahk?? pren????anie.',
            short_description: 'notebook ??? 15,6" uhloprie??ka ??? matn?? displej ??? 1920 ?? 1080 px ??? procesor Intel Core i3-1005G1 (2-jadrov?? ??? a?? 3,4 GHz) ??? ??lo??isko SSD 512 GB ??? pam???? RAM 8 GB ??? integrovan?? grafick?? karta Intel UHD ??? HDMI ??? 1?? USB-C ??? 3?? USB 3.0 ??? Bluetooth 5.0 ??? Wi-Fi 802.11ac ??? ????ta??ka pam????ov??ch kariet ??? kl??vesnica s numerickou ??as??ou ??? opera??n?? syst??m Windows 10 Pro',
            image_urls: ['https://www.datart.sk/foto/800/6/5/8/product_4857856.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/7/8/product_4857875.jpg'],
            png_image: ''
        },
        {
            id: 30,
            category: 3,
            title: 'Lenovo Yoga Smart',
            version: 'Tab 10.1 32 GB',
            price: 279.90,
            discount_bollean: true,
            discount_price: 191.90,
            producer: 'Lenovo',
            availability: 'Na sklade',
            colors: [{
                title: 'Siv??',
                hex: '#c0c0c0'
            }],
            description_title: 'Lenovo Smart Tab 10.1 32 GB, siv??',
            description: 'Lenovo Smart Tab je tablet, ktor?? vo va??ej dom??cnosti pokojne vyu??ijete aj ako smart asistenta. Okrem in??ho pon??ka ve??k?? 10,1-palcov?? displej s n??dhern??m rozl????en??m 1920??1200 px a perfektn?? zvuk, ktor?? hr?? z reproduktorov. A nie hocijak??ch, ale tak??ch, ktor?? vyladili odborn??ci z JBL. R??chlos?? a komfortn?? pou????vanie zaru??uje kombin??cia 8-jadrov??ho procesora Snapdragon 439 s 3 GB opera??nou pam????ou a opera??n??m syst??mom Android. Tablet je jedine??n?? nielen pre jeho obrovsk?? 11-hodinov?? v??dr??, ale aj pre jeho integrovan?? stojan??ek, s ktor??m sa v??m bud?? filmy pozera?? ove??a lep??ie. Stojan vyu??ijete naozaj na ??oko??vek, ??o v??m napadne.',
            short_description: 'dotykov?? tablet ??? 10,1" uhloprie??ka ??? IPS displej ??? 1920 ?? 1200 px ??? procesor Qualcomm Snapdragon 439 (8jadrov?? - a?? 2,0 GHz) ??? pam???? RAM 3 GB ??? intern?? pam???? 32 GB ??? microSD slot (do 256 GB) ??? fotoapar??t 5/8 Mpx (predn??/zadn??) ??? Bluetooth ??? GPS ??? Wi-Fi ??? kapacita bat??rie 7 000 mAh ??? Android 10 (Android Q)',
            image_urls: ['https://www.datart.sk/foto/800/7/7/0/product_3967077.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/8/0/product_3967081.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/8/0/product_3967083.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/8/0/product_3967087.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/9/0/product_3967093.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/0/1/product_3967105.jpg'],
            png_image: ''
        },
        {
            id: 31,
            category: 3,
            title: 'Samsung Galaxy',
            version: 'Tab S8 Ultra Wi-Fi',
            price: 1149.00,
            discount_bollean: false,
            producer: 'Samsung',
            availability: 'Posledn?? kusy',
            colors: [{
                title: '??ed??',
                hex: '#4d4d4d'
            }],
            description_title: 'Samsung Galaxy Tab S8 Ultra, ??ed??',
            description: 'Galaxy Tab S8 Ultra je dokonalou demon??tr??ciou toho, ??e tablet dok????e v??konom aj funkciami nahradi?? po????ta?? a sta?? sa nekompromisn??m zariaden??m pre pr??cu aj z??bavu. Prin????a obrovsk?? v??kon prostredn??ctvom procesora Snapdragon 8 Gen 1 a pr??cu aj z??bavu serv??ruje cez n??dhern?? 14,6-palcov?? Super AMOLED displej so 120 Hz technol??giou pre dokonale plynul?? zobrazenie. Bat??ria s kapacitou 11 200 mAh je garanciou dlhej v??dr??e. Produktivitu pozdvihne aj v??aka dod??van??mu stylusu S Pen a bezpe??ie d??t zaist?? ????ta??ka odtla??ku prstov integrovan?? do displeja.',
            short_description: 'dotykov?? tablet ??? 14,6" uhloprie??ka ??? Super AMOLED displej ??? 2960 ?? 1848 px ??? procesor Qualcomm Snapdragon 8 Gen 1 (8-jadrov??) ??? pam???? RAM 8 GB ??? intern?? pam???? 128 GB ??? microSD slot (do 1 TB) ??? fotoapar??t 12 + 12 / 13 + 6 Mpx (predn??/zadn??) ??? Bluetooth ??? GPS ??? Wi-Fi ??? kapacita bat??rie 11 200 mAh ??? Android 12',
            image_urls: ['https://www.datart.sk/foto/800/3/6/9/product_4909963.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/6/9/product_4909965.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/6/9/product_4909967.jpg'],
            png_image: ''
        },
        {
            id: 32,
            category: 3,
            title: 'Apple iPad',
            version: 'Air (2022) Wi-Fi 256GB',
            price: 849.00,
            discount_bollean: false,
            producer: 'Apple',
            availability: 'Dostupn?? od 19.04',
            colors: [{
                title: 'Modr??',
                hex: '#8e9dba'
            }],
            description_title: 'Apple iPad Air (2022) Wi-Fi 256GB, modr??',
            description: 'Apple iPad Air (2022) sa st??va v??aka nasadeniu vysokov??konn??ho ??ipu Apple M1 v kombin??cii s vynikaj??cim syst??mom iPadOS e??te schopnej????m zariaden??m, ktor?? skvele posl????i na z??bavu aj seri??znu pr??cu. Je perfektn??m n??strojom aj na n??ro??n?? nasadenie na cest??ch, ??o potvrdzuje ako luxusn?? 10,9-palcov?? Liquid Retina displej, tak aj a?? 10-hodinov?? v??dr??. ????ta??ku odtla??kov prstov m?? ??ikovne integrovan?? do horn??ho tla??idla na r??chle a zabezpe??en?? prihl??senie do syst??mu, rovnako ako na verifik??ciu platieb a pod. M?? tie?? dvakr??t r??chlej???? USB-C oproti minulej gener??cii aj lep??ie fotoapar??ty ??? predn?? dokonca vr??tane u??ito??nej funkcie centrovania. ',
            short_description: 'dotykov?? tablet ??? 10,9" uhloprie??ka ??? Liquid Retina displej ??? 2360 ?? 1640 px ??? procesor Apple M1 (8-jadrov??) ??? intern?? pam???? 256 GB ??? fotoapar??t 12/12 Mpx (predn??/zadn??) ??? Bluetooth 5.0 ??? Wi-Fi ax ??? ????ta??ka odtla??kov prstov ??? USB-C ??? iPadOS',
            image_urls: ['https://www.datart.sk/foto/800/0/5/9/product_4956950.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/5/9/product_4956953.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/5/9/product_4956955.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/5/9/product_4956957.jpg'],
            png_image: ''
        },
        {
            id: 33,
            category: 3,
            title: 'Lenovo Tab',
            version: 'P11 Plus 6GB/128GB',
            price: 299.90,
            discount_bollean: true,
            discount_price: 279.00,
            producer: 'Lenovo',
            availability: 'Posledn?? kusy',
            colors: [{
                title: 'Siv??',
                hex: '#c0c0c0'
            }],
            description_title: 'Lenovo Tab P11 Plus, siv??',
            description: 'Dotykov?? tablet Lenovo Tab P11 Plus v??s nikdy nesklame a zaist?? v??m v??born?? z??bavu doma aj na cest??ch. Pon??ka vysok?? rozl????enie displeja a ??pi??kov?? v??kon, o ktor?? sa star?? osemjadrov?? procesor Heli G90T spolu so 4 GB opera??nou pam????ou. Pomocou dvojice fotoapar??tov zaznamen??te ka??d?? okamih na sn??mke ??i videu alebo predn?? kameru m????ete pou??i?? aj pre videohovory s rodinou a priate??mi. Tablet disponuje funkciou GPS, m????ete ho preto pou????va?? aj na vyh??adanie a zaznamenanie trasy, napr. na v??letoch.',
            short_description: 'dotykov?? tablet ??? 11" uhloprie??ka ??? 2K IPS displej ??? 2000 ?? 1200 px ??? procesor Helio G90T (8-jadrov?? ??? a?? 2,05 GHz) ??? pam???? RAM 6 GB ??? intern?? pam???? 128 GB ??? microSD slot (do 256 GB) ??? fotoapar??t 8/13 Mpx (predn??/zadn??) ??? Bluetooth ??? GPS ??? Wi-Fi ??? kapacita bat??rie 7 500 mAh ??? Android 11',
            image_urls: ['https://www.datart.sk/foto/800/2/7/1/product_4776172.jpg', 'https://www.datart.sk/foto/ilustrace/800/4/7/1/product_4776174.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/7/1/product_4776176.jpg'],
            png_image: ''
        },
        {
            id: 34,
            category: 3,
            title: 'iGET SMART',
            version: 'L206',
            price: 199.90,
            discount_bollean: true,
            discount_price: 174.00,
            producer: 'iGET',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#000'
                },
                {
                    title: 'Modr??',
                    hex: '#8e9dba'
                }
            ],
            description_title: 'iGET SMART L206, ??ierna/modr??',
            description: 'S tabletom iGET SMART L206 si u??ijete v??etok multimedi??lny obsah od filmov a?? po hry prostredn??ctvom kr??sneho 10,36" IPS displeja s ve??mi jemn??m rozl????en??m 2000 ?? 1200 px a IPS technol??giou pre perfektn?? farby a skvel?? pozorovacie uhly. Tento model pritom vyu????va opera??n?? syst??m Android 11 a v??kon obstar??va osemjadrov?? procesor s taktom 1,8 GHz doplnen?? o 4 GB RAM a tie?? 128 GB ??lo??isko roz????rite??n?? pam????ov??mi kartami. Spo??ahn???? sa m????ete aj na bezprobl??mov?? spojenie vzh??adom k Wi-Fi a Bluetooth, ku ktor??mu sa prid??va obrovsk?? tromf v podobe podpory 4G LTE. To znamen??, ??e si po vlo??en?? d??tovej SIM karty m????ete internetov?? pripojenie u????va?? kedyko??vek a kdeko??vek. Okrem toho ale prin????a aj GPS, dva fotoapar??ty alebo dlh?? v??dr?? 5 000 mAh bat??rie.',
            short_description: 'dotykov?? tablet ??? 10,36" uhloprie??ka ??? IPS displej ??? 2000 ?? 1200 px ??? procesor UniSoc T610 (8-jadrov?? - a?? 1,8 GHz) ??? pam???? RAM 4 GB ??? intern?? pam???? 128 GB ??? microSD slot (do 128 GB) ??? fotoapar??t 2/5 Mpx (predn??/zadn??) ??? Bluetooth ??? Wi-Fi ??? 4G LTE ??? GPS ??? kapacita bat??rie 5 000 mAh ??? Android 11',
            image_urls: ['https://www.datart.sk/foto/800/2/2/8/product_4674822.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/2/8/product_4674826.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/3/8/product_4674830.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/3/8/product_4674832.jpg'],
            png_image: ''
        },
        {
            id: 35,
            category: 3,
            title: 'Xiaomi Pad',
            version: '5 siv??',
            price: 359.00,
            discount_bollean: false,
            producer: 'Xiaomi',
            availability: 'Posledn?? kusy',
            colors: [{
                title: 'Siv??',
                hex: '#c0c0c0'
            }],
            description_title: 'Xiaomi Pad 5, siv??',
            description: 'Tablet je ??ikovn?? dotykov?? multifunk??n?? zariadenie, na ktorom mili??ny ??ud?? sleduj?? seri??ly, ????taj?? knihy, hraj?? hry alebo pracuj??. Jedn??m z t??chto tabletov je aj Xiaomi Pad 5, ktor??ho slu??by budete m??c?? naplno vyu??i??, ??i u?? budete pr??ve doma alebo v kancel??rii. Jeho dom??nou je bezpochyby kr??sny 11-palcov?? IPS displej s rozl????en??m WQHD+ a 120 Hz obnovovacou frekvenciou. Je vybaven?? cel??m radom modern??ch technol??gi?? prin????aj??cich skvel?? z????itok zo sledovania, medzi ktor?? patr?? napr??klad re??im Low Blue Light akt??vne zni??uj??ci vy??arovan?? modr?? svetlo a True Display, schopn?? prisp??sobova?? obrazovku tak, aby poskytla ??ist?? a ostr?? obraz aj za jasn??ho slne??n??ho svetla. O svi??n?? pr??cu so zariaden??m sa postar?? mobiln?? platforma Qualcomm Snapdragon 860 v spojen?? so 6 GB opera??nou pam????ou. Vy tak budete m??c?? ma?? ??ahko otvoren??ch aj nieko??ko aplik??ci?? naraz, ??o prispeje k lep??ej pracovnej efektivite. T?? navy??e nebude nijako dr??an?? sp???? nedostatkom energie ??? o ??u sa za ka??d??ch okolnost?? postar?? ve??k?? bat??ria s kapacitou 8 720 mAh, ktor?? navy??e na pln?? kapacitu dobijete prostredn??ctvom a?? 22,5 W dr??tov??ho dob??jania.',
            short_description: 'dotykov?? tablet ??? 11" uhoprie??ka ??? IPS displej ??? 2560 ?? 1600 px ??? procesor Qualcomm Snapdragon 860 (8-jadrov??) ??? intern?? pam???? 128 GB ??? opera??n?? pam???? 6 GB ??? zadn?? fotoapar??t 13 (f/2.0) Mpx ??? predn?? fotoapar??t 8 (f/2.0) Mpx ??? Bluetooth 5.0 ??? Wi-Fi 802.11ac ??? Android 11',
            image_urls: ['https://www.datart.sk/foto/800/1/1/0/product_4818011.jpg', 'https://www.datart.sk/foto/ilustrace/800/5/1/0/product_4818015.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/1/0/product_4818019.jpg', 'https://www.datart.sk/foto/ilustrace/800/1/2/0/product_4818021.jpg'],
            png_image: ''
        },
        {
            id: 36,
            category: 4,
            title: 'Apple AirPods',
            version: 'Pro 2021',
            price: 279.00,
            discount_bollean: false,
            producer: 'Apple',
            availability: 'Posledn?? kusy',
            colors: [{
                title: 'Biela',
                hex: '#fff'
            }],
            description_title: 'Apple AirPods Pro, biela',
            description: 'Zna??ka Apple patr?? na popredn?? prie??ky v kvalite aj popularite smart produktov. Bezdr??tov?? sl??chadl?? Apple AirPods Pro pote??ia v??etk??ch milovn??kov hudby. Jednoducho ich pripoj??te k svojmu iPhonu aj hodink??m Apple Watch, aby ste si mohli u??i?? po????vanie ob????ben??ch pesni??iek v ??pi??kovej kvalite. Sl??chadl?? m????ete pou????va?? v ka??dom prostred??. V??aka akt??vnemu potla??eniu hluku v??s nebude nikto a ni?? vyru??ova?? ani na tom najhlu??nej??om mieste. V pr??pade potreby ??ahko zapnete re??im priepustnosti, ????m okam??ite z??skate preh??ad o tom, ??o sa okolo v??s odohr??va. O v??born?? kvalitu zvuku sa star?? ka??d?? jednotliv?? komponent sl??chadiel, ktor?? dohromady tvoria len tie najkvalitnej??ie materi??ly. Nech??ba tu dvojica mikrof??nov na handsfree volanie alebo akcelerometer na rozpoznanie pohybu ??i re??i. Pomocou dotykov??ho ovl??dania zvl??dnete meni?? hlasitos??, preskakova?? medzi skladbami aj vybavova?? telefon??ty. Pre dobitie sta???? sl??chadl?? vlo??i?? do dod??van??ho bezdr??tov??ho puzdra, ktor?? nav????i ich v??dr?? z 4,5 hodiny a?? na 24 hod??n po????vania, resp. z 3,5 hod na 18 hod??n bezdr??tov??ho hovoru.',
            short_description: 'bezdr??tov?? sl??chadl?? ??? v??dr?? a?? 4,5 h po????vania alebo 3,5 h hovoru, s puzdrom a?? 24 h po????vania a 18 h hovoru ??? odolnos?? IPX4 (nie s?? vhodn?? na vodn?? ??porty) ??? akt??vne potla??enie hluku ??? re??im priepustnosti ??? adapt??vna ekvaliz??cia ??? vyrovn??vanie tlaku ??? budi?? Apple s vysoko pohyblivou membr??nou ??? zosil??ova?? s vysok??m dynamick??m rozsahom ??? 2 mikrof??ny s funkciou formovania l????a ??? 2 optick?? sn??ma??e ??? akcelerometer na rozpoznanie pohybu a re??i ??? tlakov?? sn??ma?? ??? dotykov?? ovl??danie ??? nab??jacie puzdro v balen?? ??? r??chle nab??janie ??? Bluetooth 5.0 ??? 3 ve??kosti silik??nov??ch koncoviek v balen??',
            image_urls: ['https://www.datart.sk/foto/800/3/9/5/product_4794593.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/9/5/product_4794596.jpg'],
            png_image: ''
        },
        {
            id: 37,
            category: 4,
            title: 'Samsung Galaxy',
            version: 'Buds Pro',
            price: 229.00,
            discount_bollean: true,
            discount_price: 199.00,
            producer: 'Samsung',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Samsung Galaxy Buds Pro, ??ierna',
            description: 'Vychutnajte si pohodln?? po????vanie vysokej kvality s bezdr??tov??mi sl??chadlami Galaxy Buds Pro od spolo??nosti Samsung. Vyu??ite pokrokov?? technol??giu ANC, ktor?? pon??ka potl????anie okolit??ho hluku, ktor?? viete sami jednoducho ovl??da?? a prisp??sobova??. Je na v??s, ??i budete chcie?? po??u?? aj okolit?? zvuk alebo si rad??ej dopria?? len s??streden?? po????vanie vami zvolen??ho obsahu.',
            short_description: 'bezdr??tov?? sl??chadl?? ??? v??dr?? a?? 28 hod??n (8 hod??n akt??vneho po????vania) ??? odolnos?? IPX7 ??? 11mm basov?? reproduktor ??? 6,5mm v????kov?? reproduktor ??? Bluetooth v5.0 ??? 2 integrovan?? mikrof??ny v ka??dom sl??chadle ??? akcelometer ??? senzor pribl????enia ??? Hallov senzor ??? senzor dotyku ??? detekcia vlo??enia a vytiahnutia z ucha ??? kompatibiln?? s Android 5.0 a vy??????m',
            image_urls: ['https://www.datart.sk/foto/800/2/3/1/product_4436132.jpg', 'https://www.datart.sk/foto/ilustrace/800/6/3/1/product_4436136.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/4/1/product_4436142.jpg'],
            png_image: ''
        },
        {
            id: 38,
            category: 4,
            title: 'Niceboy HIVE',
            version: 'Pods 2 ??ierna',
            price: 36.90,
            discount_bollean: false,
            producer: 'Niceboy',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Niceboy HIVE Pods 2, ??ierna',
            description: 'Zaobstarajte si True Wireless sl??chadl?? Niceboy HIVE Pods 2 a zabudnite na v??etky obmedzenia spojen?? s k??blami. V??aka technol??gii MaxxBass si navy??e u??ijete skvel?? zvuk, a to a?? po dobu 35 hod??n. Sl??chadl?? nabijete pohodlne a r??chlo v??aka ??peci??lnemu dob??jaciemu puzdru, ktor?? ocen??te aj pri presnose. Vitajte v dobe bezdr??tovej. Pre?? s nepr??jemn??mi k??blami, ktor??m u?? d??vno odzvonilo. S?? tu HIVE pods 2, ktor?? s?? navrhnut?? tak, aby zvl??dli presne to ??o vy. ??i u?? ste akt??vne ??portovci, alebo radi po????vate hudbu cestou do pr??ce, nov?? HIVE pods 2 ocen??te v??dy a v??ade.',
            short_description: 'bezdr??tov?? sl??chadl?? do u???? ??? v??dr?? a?? 35 h ??? frekvencia 20 Hz a?? 15 kHz ??? citlivos?? 94 dB ??? odolnos?? IPX5 ??? dob??jacie puzdro ??? technol??gia MaxxBass pre lep???? zvuk ??? Bluetooth 5.0 ??? integrovan?? mikrof??n pre handsfree hovory ??? 6 mm meni??e ??? dosah 10 m',
            image_urls: ['https://www.datart.sk/foto/800/9/1/7/product_3919719.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/2/7/product_3919727.jpg', 'https://www.datart.sk/foto/ilustrace/800/0/0/2/product_3946200.jpg'],
            png_image: ''
        },
        {
            id: 39,
            category: 4,
            title: 'Sony',
            version: 'WF-1000XM4 ??ierna',
            price: 279.00,
            discount_bollean: true,
            discount_price: 274.90,
            producer: 'Sony',
            availability: 'Na sklade',
            colors: [{
                title: '??ierna',
                hex: '#000'
            }],
            description_title: 'Sony WF-1000XM4, ??ierna',
            description: 'Pri navrhovan?? a v??robe WF-1000XM4 vyu??ila zna??ka Sony v??etky svoje sk??senosti a vytvorila absol??tne nekompromisn??, skuto??ne bezdr??tov?? sl??chadl?? p????iace sa v??aka ??pi??kov??mu procesoru V1 t??m najlep????m potla??en??m okolit??ch ruchov (ANC) na trhu. Rovnako tak ale exceluj?? kvalitou zvuku vo vysokom rozl????en?? s podporou Hi-Res a LDAC. Kombinovan?? v??dr?? na nabitie u nich dosahuje a?? 36 hod??n (24 hod??n s aktivovan??m ANC) a nadchn?? i modern??m nab??jan??m ??? bu?? cez USB-C, alebo bezdr??tovo s technol??giou Qi. S kon??trukciou odolnou pod??a IPX4 sa nemus??te ob??va?? pou??i?? ich pri ??porte a nadchn?? tie?? vysokou kvalitou hovorov vzh??adom na technol??giu Precise Voice Pickup. Opomen???? nemo??no ani vynikaj??cu aplik??ciu Sony Headphones Connect, v ktorej si podrobne nastav??te v??etko, ??o potrebujete.',
            short_description: 'bezdr??tov?? sl??chadl?? ??? v??dr?? a?? 36 hod. ??? frekvencia 20 Hz a?? 40 kHz ??? odolnos?? IPX4 ??? 6mm meni??e ??? Bluetooth 5.2 ??? integrovan?? mikrof??n ??? technol??gia potla??enia okolit??ho ruchu ANC ??? technol??gia Precise Voice Pickup ??? mobiln?? aplik??cia ??? procesor V1 ??? Google Fast Pair ??? podpora hlasov??ch asistentov',
            image_urls: ['https://www.datart.sk/foto/800/9/0/8/product_4642809.jpg', 'https://www.datart.sk/foto/ilustrace/800/2/1/8/product_4642812.jpg'],
            png_image: ''
        },
        {
            id: 40,
            category: 4,
            title: 'Xiaomi Redmi',
            version: 'Buds 3 Pro',
            price: 61.90,
            discount_bollean: false,
            producer: 'Xiaomi',
            availability: 'Na sklade',
            colors: [{
                    title: '??ierna',
                    hex: '#000'
                },
                {
                    title: 'Biela',
                    hex: '#fff'
                }
            ],
            description_title: 'Xiaomi Redmi Buds 3 Pro',
            description: 'Nech u?? v??s osud zavanie kamko??vek, v??dy si m????ete spr??jemni?? de?? po????van??m svojej ob????benej hudby, audioknihy alebo napr??klad podcastu. Sta???? ma?? poruke kompaktn?? bezdr??tov?? sl??chadl?? Xiaomi Redmi Buds 3 Pro (34719). M??te s nimi zaisten?? perfektn?? kvalitu zvuku, ????asn?? pohodlie i ??pln?? s??kromie ??? sl??chadl?? vyu????vaj?? technol??giu du??lneho akt??vneho potla??enia hluku, tak??e v??s pri po????van?? absol??tne ni?? neru????. Sl??chadl?? disponuj?? aj vstavan??m mikrof??nom, a tak ich m????ete vyu????va?? aj na handsfree telefonovanie. V??aka technol??gii du??lneho akt??vneho potla??enia hluku s umelou inteligenciou m??te za ak??chko??vek okolnost?? zaisten?? perfektn?? zvukov?? z????itok. Sl??chadl?? toti?? dok????u rozpozna?? typ okolit??ch ruchov a na z??klade toho vyladi?? zvuk presne pod??a danej situ??cie ??? inak potla??ia okolit?? hluk v metre, inak v kaviarni a e??te inak v kni??nici ??i kancel??rii.',
            short_description: 'bezdr??tov?? sl??chadl?? ??? v??dr?? a?? 28 hod ??? impedancia 32 ohmov ??? odolnos?? IPX4 ??? 9 mm kompozitn?? vibra??n?? membr??nov?? cievka ??? Bluetooth 5.2 ??? integrovan?? mikrof??n ??? technol??gia du??lneho akt??vneho potla??enia hluku',
            image_urls: ['https://www.datart.sk/foto/800/5/5/9/product_4757955.jpg', 'https://www.datart.sk/foto/ilustrace/800/7/5/9/product_4757957.jpg', 'https://www.datart.sk/foto/ilustrace/800/9/5/9/product_4757959.jpg', 'https://www.datart.sk/foto/ilustrace/800/3/6/9/product_4757963.jpg'],
            png_image: ''
        },
    ];

    var sales = [{
            id: 0,
            title: 'Doprava',
            subtitle: 'nad ',
            bold_subtitle: '100??? zadarmo',
            type: 'R??chlo a spo??ahlivo',
            image: 'https://www.pngall.com/wp-content/uploads/5/Box-Transparent.png',
        },
        {
            id: 1,
            title: 'Prislu??enstvo',
            subtitle: 'pri n??kupe nad',
            bold_subtitle: '120??? zadarmo',
            type: '??peci??lna ponuka',
            image: 'https://images.samsung.com/is/image/samsung/p6pim/in/galaxy-s21/gallery/in-galaxy-buds-pro-r190-sm-r190nzkainu-363149145?$720_576_PNG$',
        },
        {
            id: 2,
            title: 'Do konca t????d??a',
            subtitle: 'z??avy',
            bold_subtitle: 'a?? 60%',
            type: 'Black Friday',
            image: 'https://coachsportland.co.uk/wp-content/uploads/2019/11/Black-Friday-High-Quality-PNG.png',
        },
    ];

    /* src\components\Sale.svelte generated by Svelte v3.46.4 */
    const file$j = "src\\components\\Sale.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (17:20) {#if shop_now_btn}
    function create_if_block$b(ctx) {
    	let div;
    	let a;
    	let t;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("Nak??pova?? ");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-chevron-right svelte-1k1vs5");
    			add_location(i, file$j, 17, 79, 707);
    			attr_dev(a, "href", "#/obchod");
    			attr_dev(a, "class", "svelte-1k1vs5");
    			add_location(a, file$j, 17, 50, 678);
    			attr_dev(div, "class", "shop-now-btn svelte-1k1vs5");
    			add_location(div, file$j, 17, 24, 652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    			append_dev(a, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(17:20) {#if shop_now_btn}",
    		ctx
    	});

    	return block;
    }

    // (8:8) {#each sales as sale}
    function create_each_block$c(ctx) {
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div4;
    	let div1;
    	let t1_value = /*sale*/ ctx[1].type + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*sale*/ ctx[1].title + "";
    	let t3;
    	let t4;
    	let div3;
    	let t5_value = /*sale*/ ctx[1].subtitle + "";
    	let t5;
    	let t6;
    	let b;
    	let t7_value = /*sale*/ ctx[1].bold_subtitle + "";
    	let t7;
    	let t8;
    	let t9;
    	let if_block = /*shop_now_btn*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			b = element("b");
    			t7 = text(t7_value);
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			if (!src_url_equal(img.src, img_src_value = /*sale*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*sale*/ ctx[1].title);
    			attr_dev(img, "class", "svelte-1k1vs5");
    			add_location(img, file$j, 10, 20, 259);
    			attr_dev(div0, "class", "sale-img svelte-1k1vs5");
    			add_location(div0, file$j, 9, 16, 215);
    			attr_dev(div1, "class", "sale-type svelte-1k1vs5");
    			add_location(div1, file$j, 13, 20, 384);
    			attr_dev(div2, "class", "sale-title svelte-1k1vs5");
    			add_location(div2, file$j, 14, 20, 446);
    			attr_dev(b, "class", "svelte-1k1vs5");
    			add_location(b, file$j, 15, 63, 553);
    			attr_dev(div3, "class", "sale-subtitle svelte-1k1vs5");
    			add_location(div3, file$j, 15, 20, 510);
    			attr_dev(div4, "class", "info svelte-1k1vs5");
    			add_location(div4, file$j, 12, 16, 344);
    			attr_dev(div5, "class", "sale-card svelte-1k1vs5");
    			add_location(div5, file$j, 8, 12, 174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, t5);
    			append_dev(div3, t6);
    			append_dev(div3, b);
    			append_dev(b, t7);
    			append_dev(div4, t8);
    			if (if_block) if_block.m(div4, null);
    			append_dev(div5, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (/*shop_now_btn*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(8:8) {#each sales as sale}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let div;
    	let each_value = sales;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "sales container svelte-1k1vs5");
    			add_location(div, file$j, 6, 4, 100);
    			add_location(main, file$j, 5, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shop_now_btn, sales*/ 1) {
    				each_value = sales;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sale', slots, []);
    	let { shop_now_btn } = $$props;
    	const writable_props = ['shop_now_btn'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sale> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('shop_now_btn' in $$props) $$invalidate(0, shop_now_btn = $$props.shop_now_btn);
    	};

    	$$self.$capture_state = () => ({ sales, shop_now_btn });

    	$$self.$inject_state = $$props => {
    		if ('shop_now_btn' in $$props) $$invalidate(0, shop_now_btn = $$props.shop_now_btn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shop_now_btn];
    }

    class Sale extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { shop_now_btn: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sale",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shop_now_btn*/ ctx[0] === undefined && !('shop_now_btn' in props)) {
    			console.warn("<Sale> was created without expected prop 'shop_now_btn'");
    		}
    	}

    	get shop_now_btn() {
    		throw new Error("<Sale>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shop_now_btn(value) {
    		throw new Error("<Sale>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.46.4 */
    const file$i = "src\\routes\\Home.svelte";

    function create_fragment$i(ctx) {
    	let t0;
    	let main;
    	let div8;
    	let div7;
    	let div5;
    	let div0;
    	let t2;
    	let div1;
    	let t3_value = products[0].title + "";
    	let t3;
    	let t4;
    	let span;
    	let t6;
    	let div2;
    	let t8;
    	let div4;
    	let a;
    	let i;
    	let t9;
    	let t10;
    	let div3;
    	let t13;
    	let div6;
    	let img0;
    	let img0_src_value;
    	let t14;
    	let div16;
    	let div15;
    	let div13;
    	let div9;
    	let t16;
    	let div10;
    	let t18;
    	let div11;
    	let t20;
    	let div12;
    	let t22;
    	let div14;
    	let img1;
    	let img1_src_value;
    	let t23;
    	let div30;
    	let div29;
    	let div19;
    	let div17;
    	let t25;
    	let div18;
    	let t27;
    	let div22;
    	let div20;
    	let t29;
    	let div21;
    	let t31;
    	let div25;
    	let div23;
    	let t33;
    	let div24;
    	let t35;
    	let div28;
    	let div26;
    	let t37;
    	let div27;
    	let t39;
    	let div37;
    	let sale;
    	let t40;
    	let div36;
    	let div31;
    	let img2;
    	let img2_src_value;
    	let t41;
    	let div32;
    	let img3;
    	let img3_src_value;
    	let t42;
    	let div33;
    	let img4;
    	let img4_src_value;
    	let t43;
    	let div34;
    	let img5;
    	let img5_src_value;
    	let t44;
    	let div35;
    	let img6;
    	let img6_src_value;
    	let current;

    	sale = new Sale({
    			props: { shop_now_btn: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div8 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "Najpredavanej????";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			span = element("span");
    			span.textContent = `${products[0].version}`;
    			t6 = space();
    			div2 = element("div");
    			div2.textContent = `${products[0].short_description}`;
    			t8 = space();
    			div4 = element("div");
    			a = element("a");
    			i = element("i");
    			t9 = text("\r\n                        Nak??pova??");
    			t10 = space();
    			div3 = element("div");
    			div3.textContent = `${/*product_price*/ ctx[0]} ???`;
    			t13 = space();
    			div6 = element("div");
    			img0 = element("img");
    			t14 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div13 = element("div");
    			div9 = element("div");
    			div9.textContent = "Ver??me v lep??ie zajtraj??ky";
    			t16 = space();
    			div10 = element("div");
    			div10.textContent = "Vitajte v ElektroX! Prin????ame na????m z??kaznikom ??irok?? ponuku produktov z viacer??ch kateg??rii";
    			t18 = space();
    			div11 = element("div");
    			div11.textContent = "Na??a spolo??nos?? je na trhu u?? 15 rokov. U?? 15 rokov prin????ame na????m z??kaznikom prijemn?? pocit z n??kupovania. Pon??kame V??m ??irok?? ponuku produktov z viacer??ch kateg??rii, ktor?? si objedn??te z pohodlia V????ho domova a my V??m va?? n??kup doru??ime a?? domov.";
    			t20 = space();
    			div12 = element("div");
    			div12.textContent = "Tak nev??hajte a nak??pte u n??s u?? teraz";
    			t22 = space();
    			div14 = element("div");
    			img1 = element("img");
    			t23 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			div17.textContent = "10M";
    			t25 = space();
    			div18 = element("div");
    			div18.textContent = "????astn??ch Z??kaznikov";
    			t27 = space();
    			div22 = element("div");
    			div20 = element("div");
    			div20.textContent = "20M";
    			t29 = space();
    			div21 = element("div");
    			div21.textContent = "Glob??lnch Z??kaznikov";
    			t31 = space();
    			div25 = element("div");
    			div23 = element("div");
    			div23.textContent = "99+";
    			t33 = space();
    			div24 = element("div");
    			div24.textContent = "Odborn??ch Zamestnancov";
    			t35 = space();
    			div28 = element("div");
    			div26 = element("div");
    			div26.textContent = "30+";
    			t37 = space();
    			div27 = element("div");
    			div27.textContent = "Z??skan??ch Ocenen??";
    			t39 = space();
    			div37 = element("div");
    			create_component(sale.$$.fragment);
    			t40 = space();
    			div36 = element("div");
    			div31 = element("div");
    			img2 = element("img");
    			t41 = space();
    			div32 = element("div");
    			img3 = element("img");
    			t42 = space();
    			div33 = element("div");
    			img4 = element("img");
    			t43 = space();
    			div34 = element("div");
    			img5 = element("img");
    			t44 = space();
    			div35 = element("div");
    			img6 = element("img");
    			document.title = "Domov";
    			attr_dev(div0, "class", "subtitle svelte-1tmoz7g");
    			add_location(div0, file$i, 18, 16, 506);
    			attr_dev(span, "class", "ultra-blue svelte-1tmoz7g");
    			add_location(span, file$i, 19, 55, 606);
    			attr_dev(div1, "class", "title svelte-1tmoz7g");
    			add_location(div1, file$i, 19, 16, 567);
    			attr_dev(div2, "class", "description svelte-1tmoz7g");
    			add_location(div2, file$i, 20, 16, 683);
    			attr_dev(i, "class", "fas fa-shopping-cart svelte-1tmoz7g");
    			add_location(i, file$i, 23, 24, 894);
    			attr_dev(a, "href", "#/obchod/smartf??ny/" + /*product_url*/ ctx[1]);
    			attr_dev(a, "class", "shop-btn svelte-1tmoz7g");
    			add_location(a, file$i, 22, 20, 808);
    			attr_dev(div3, "class", "price svelte-1tmoz7g");
    			add_location(div3, file$i, 26, 20, 1014);
    			attr_dev(div4, "class", "btn-price svelte-1tmoz7g");
    			add_location(div4, file$i, 21, 16, 763);
    			attr_dev(div5, "class", "product-info svelte-1tmoz7g");
    			add_location(div5, file$i, 17, 12, 462);
    			if (!src_url_equal(img0.src, img0_src_value = products[0].png_image)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", products[0].title);
    			attr_dev(img0, "class", "svelte-1tmoz7g");
    			add_location(img0, file$i, 30, 16, 1157);
    			attr_dev(div6, "class", "product-img svelte-1tmoz7g");
    			add_location(div6, file$i, 29, 12, 1114);
    			attr_dev(div7, "class", "container slider-con svelte-1tmoz7g");
    			add_location(div7, file$i, 16, 8, 414);
    			attr_dev(div8, "class", "slider svelte-1tmoz7g");
    			add_location(div8, file$i, 15, 4, 384);
    			attr_dev(div9, "class", "subtitle svelte-1tmoz7g");
    			add_location(div9, file$i, 37, 16, 1390);
    			attr_dev(div10, "class", "title svelte-1tmoz7g");
    			add_location(div10, file$i, 38, 16, 1462);
    			attr_dev(div11, "class", "text svelte-1tmoz7g");
    			add_location(div11, file$i, 39, 16, 1597);
    			attr_dev(div12, "class", "text2 svelte-1tmoz7g");
    			add_location(div12, file$i, 40, 16, 1888);
    			attr_dev(div13, "class", "left svelte-1tmoz7g");
    			add_location(div13, file$i, 36, 12, 1354);
    			if (!src_url_equal(img1.src, img1_src_value = "https://www.thehindubusinessline.com/migration_catalog/article18241793.ece/ALTERNATES/LANDSCAPE_1200/ct09_lady.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "N??kupy z pohodlia domova");
    			attr_dev(img1, "class", "svelte-1tmoz7g");
    			add_location(img1, file$i, 43, 16, 2022);
    			attr_dev(div14, "class", "right svelte-1tmoz7g");
    			add_location(div14, file$i, 42, 12, 1985);
    			attr_dev(div15, "class", "container about-container svelte-1tmoz7g");
    			add_location(div15, file$i, 35, 8, 1301);
    			attr_dev(div16, "class", "about svelte-1tmoz7g");
    			add_location(div16, file$i, 34, 4, 1272);
    			attr_dev(div17, "class", "title svelte-1tmoz7g");
    			add_location(div17, file$i, 50, 16, 2366);
    			attr_dev(div18, "class", "subtitle svelte-1tmoz7g");
    			add_location(div18, file$i, 51, 16, 2412);
    			attr_dev(div19, "class", "statistic svelte-1tmoz7g");
    			add_location(div19, file$i, 49, 12, 2325);
    			attr_dev(div20, "class", "title svelte-1tmoz7g");
    			add_location(div20, file$i, 54, 16, 2535);
    			attr_dev(div21, "class", "subtitle svelte-1tmoz7g");
    			add_location(div21, file$i, 55, 16, 2581);
    			attr_dev(div22, "class", "statistic svelte-1tmoz7g");
    			add_location(div22, file$i, 53, 12, 2494);
    			attr_dev(div23, "class", "title svelte-1tmoz7g");
    			add_location(div23, file$i, 58, 16, 2704);
    			attr_dev(div24, "class", "subtitle svelte-1tmoz7g");
    			add_location(div24, file$i, 59, 16, 2750);
    			attr_dev(div25, "class", "statistic svelte-1tmoz7g");
    			add_location(div25, file$i, 57, 12, 2663);
    			attr_dev(div26, "class", "title svelte-1tmoz7g");
    			add_location(div26, file$i, 62, 16, 2875);
    			attr_dev(div27, "class", "subtitle svelte-1tmoz7g");
    			add_location(div27, file$i, 63, 16, 2921);
    			attr_dev(div28, "class", "statistic svelte-1tmoz7g");
    			add_location(div28, file$i, 61, 12, 2834);
    			attr_dev(div29, "class", "statistics-container container svelte-1tmoz7g");
    			add_location(div29, file$i, 48, 8, 2267);
    			attr_dev(div30, "class", "statistics svelte-1tmoz7g");
    			add_location(div30, file$i, 47, 4, 2233);
    			if (!src_url_equal(img2.src, img2_src_value = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Samsung");
    			attr_dev(img2, "class", "svelte-1tmoz7g");
    			add_location(img2, file$i, 71, 16, 3171);
    			attr_dev(div31, "class", "sponsor svelte-1tmoz7g");
    			add_location(div31, file$i, 70, 12, 3132);
    			if (!src_url_equal(img3.src, img3_src_value = "https://hochwald.net/wp-content/uploads/2017/12/Apple.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Apple");
    			attr_dev(img3, "class", "svelte-1tmoz7g");
    			add_location(img3, file$i, 74, 16, 3372);
    			attr_dev(div32, "class", "sponsor svelte-1tmoz7g");
    			add_location(div32, file$i, 73, 12, 3333);
    			if (!src_url_equal(img4.src, img4_src_value = "https://www.freepnglogos.com/uploads/huawei-logo-png/huawei-logo-picture-4.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Huawei");
    			attr_dev(img4, "class", "svelte-1tmoz7g");
    			add_location(img4, file$i, 77, 16, 3526);
    			attr_dev(div33, "class", "sponsor svelte-1tmoz7g");
    			add_location(div33, file$i, 76, 12, 3487);
    			if (!src_url_equal(img5.src, img5_src_value = "https://logos-world.net/wp-content/uploads/2020/05/Xiaomi-Logo.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Xiaomi");
    			attr_dev(img5, "class", "svelte-1tmoz7g");
    			add_location(img5, file$i, 80, 16, 3702);
    			attr_dev(div34, "class", "sponsor svelte-1tmoz7g");
    			add_location(div34, file$i, 79, 12, 3663);
    			if (!src_url_equal(img6.src, img6_src_value = "https://logos-world.net/wp-content/uploads/2020/09/Nokia-Logo.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Nokia");
    			attr_dev(img6, "class", "svelte-1tmoz7g");
    			add_location(img6, file$i, 83, 16, 3866);
    			attr_dev(div35, "class", "sponsor svelte-1tmoz7g");
    			add_location(div35, file$i, 82, 12, 3827);
    			attr_dev(div36, "class", "sponsors container svelte-1tmoz7g");
    			add_location(div36, file$i, 69, 8, 3086);
    			attr_dev(div37, "class", "sales svelte-1tmoz7g");
    			add_location(div37, file$i, 67, 4, 3020);
    			add_location(main, file$i, 14, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(div5, t6);
    			append_dev(div5, div2);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    			append_dev(a, i);
    			append_dev(a, t9);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, img0);
    			append_dev(main, t14);
    			append_dev(main, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div13);
    			append_dev(div13, div9);
    			append_dev(div13, t16);
    			append_dev(div13, div10);
    			append_dev(div13, t18);
    			append_dev(div13, div11);
    			append_dev(div13, t20);
    			append_dev(div13, div12);
    			append_dev(div15, t22);
    			append_dev(div15, div14);
    			append_dev(div14, img1);
    			append_dev(main, t23);
    			append_dev(main, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div19);
    			append_dev(div19, div17);
    			append_dev(div19, t25);
    			append_dev(div19, div18);
    			append_dev(div29, t27);
    			append_dev(div29, div22);
    			append_dev(div22, div20);
    			append_dev(div22, t29);
    			append_dev(div22, div21);
    			append_dev(div29, t31);
    			append_dev(div29, div25);
    			append_dev(div25, div23);
    			append_dev(div25, t33);
    			append_dev(div25, div24);
    			append_dev(div29, t35);
    			append_dev(div29, div28);
    			append_dev(div28, div26);
    			append_dev(div28, t37);
    			append_dev(div28, div27);
    			append_dev(main, t39);
    			append_dev(main, div37);
    			mount_component(sale, div37, null);
    			append_dev(div37, t40);
    			append_dev(div37, div36);
    			append_dev(div36, div31);
    			append_dev(div31, img2);
    			append_dev(div36, t41);
    			append_dev(div36, div32);
    			append_dev(div32, img3);
    			append_dev(div36, t42);
    			append_dev(div36, div33);
    			append_dev(div33, img4);
    			append_dev(div36, t43);
    			append_dev(div36, div34);
    			append_dev(div34, img5);
    			append_dev(div36, t44);
    			append_dev(div36, div35);
    			append_dev(div35, img6);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sale.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sale.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(sale);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let product_price = products[0].price.toString().split('.').join(',');
    	let product_url = (products[0].title + ' ' + products[0].version).toLowerCase().split(' ').join('_');
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		products,
    		Sale,
    		product_price,
    		product_url
    	});

    	$$self.$inject_state = $$props => {
    		if ('product_price' in $$props) $$invalidate(0, product_price = $$props.product_price);
    		if ('product_url' in $$props) $$invalidate(1, product_url = $$props.product_url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [product_price, product_url];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    var categories = [{
            id: 0,
            title: 'Smartf??ny',
            image: 'https://static.wikia.nocookie.net/ipod/images/a/ae/IPhone_12_colors.png',
        },
        {
            id: 1,
            title: 'Inteligentn?? hodinky',
            image: 'https://images.samsung.com/is/image/samsung/p6pim/sk/2108/gallery/sk-galaxy-watch4-sm-r870nzsaeue-481789753?$720_576_PNG$',
        },
        {
            id: 2,
            title: 'Notebooky',
            image: 'https://c.s-microsoft.com/en-gb/CMSImages/w11.png?version=211d8145-0900-cbb1-30dc-dd4498912d98',
        },
        {
            id: 3,
            title: 'Tablety',
            image: 'https://clipartpngfree.com/save/electronics/electronic_equipment_electronic_sale_ipad.png',
        },
        {
            id: 4,
            title: 'Sl??chadl??',
            image: 'https://images.samsung.com/is/image/samsung/p6pim/in/galaxy-s21/gallery/in-galaxy-buds-pro-r190-sm-r190nzkainu-363149145?$720_576_PNG$',
        }
    ];

    /* src\components\BestProducts.svelte generated by Svelte v3.46.4 */
    const file$h = "src\\components\\BestProducts.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:8) {#each best_products as product}
    function create_each_block$b(ctx) {
    	let div6;
    	let div4;
    	let div0;
    	let t0_value = categories[/*product*/ ctx[1].category].title + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*product*/ ctx[1].title + "";
    	let t2;
    	let t3;
    	let t4_value = /*product*/ ctx[1].version + "";
    	let t4;
    	let t5;
    	let div3;
    	let a;
    	let i;
    	let t6;
    	let a_href_value;
    	let t7;
    	let div2;
    	let t8_value = /*product*/ ctx[1].price.toString().split('.').join(',') + "";
    	let t8;
    	let t9;
    	let t10;
    	let div5;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t11;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			a = element("a");
    			i = element("i");
    			t6 = text("\r\n                            Nak??pova??");
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = text(" ???");
    			t10 = space();
    			div5 = element("div");
    			img = element("img");
    			t11 = space();
    			attr_dev(div0, "class", "category svelte-1q2jcxp");
    			add_location(div0, file$h, 11, 20, 302);
    			attr_dev(div1, "class", "p-title svelte-1q2jcxp");
    			add_location(div1, file$h, 12, 20, 388);
    			attr_dev(i, "class", "fas fa-shopping-cart svelte-1q2jcxp");
    			add_location(i, file$h, 15, 28, 734);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[1].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[1].title + ' ' + /*product*/ ctx[1].version).toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "shop-btn svelte-1q2jcxp");
    			add_location(a, file$h, 14, 24, 519);
    			attr_dev(div2, "class", "price svelte-1q2jcxp");
    			add_location(div2, file$h, 18, 24, 866);
    			attr_dev(div3, "class", "btn-price svelte-1q2jcxp");
    			add_location(div3, file$h, 13, 20, 470);
    			attr_dev(div4, "class", "information-card svelte-1q2jcxp");
    			add_location(div4, file$h, 10, 16, 250);
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[1].png_image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[1].title);
    			attr_dev(img, "class", "svelte-1q2jcxp");
    			add_location(img, file$h, 22, 20, 1057);
    			attr_dev(div5, "class", "right-image svelte-1q2jcxp");
    			add_location(div5, file$h, 21, 16, 1010);
    			attr_dev(div6, "class", "best-product svelte-1q2jcxp");
    			add_location(div6, file$h, 9, 12, 206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, a);
    			append_dev(a, i);
    			append_dev(a, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			append_dev(div2, t9);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    			append_dev(div6, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*best_products*/ 1 && t0_value !== (t0_value = categories[/*product*/ ctx[1].category].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*best_products*/ 1 && t2_value !== (t2_value = /*product*/ ctx[1].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*best_products*/ 1 && t4_value !== (t4_value = /*product*/ ctx[1].version + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*best_products*/ 1 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[1].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[1].title + ' ' + /*product*/ ctx[1].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*best_products*/ 1 && t8_value !== (t8_value = /*product*/ ctx[1].price.toString().split('.').join(',') + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*best_products*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[1].png_image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*best_products*/ 1 && img_alt_value !== (img_alt_value = /*product*/ ctx[1].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(9:8) {#each best_products as product}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let div;
    	let each_value = /*best_products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "best-products container svelte-1q2jcxp");
    			add_location(div, file$h, 7, 4, 113);
    			add_location(main, file$h, 6, 0, 101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*best_products, categories*/ 1) {
    				each_value = /*best_products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BestProducts', slots, []);
    	let { best_products } = $$props;
    	const writable_props = ['best_products'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BestProducts> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('best_products' in $$props) $$invalidate(0, best_products = $$props.best_products);
    	};

    	$$self.$capture_state = () => ({ categories, best_products });

    	$$self.$inject_state = $$props => {
    		if ('best_products' in $$props) $$invalidate(0, best_products = $$props.best_products);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [best_products];
    }

    class BestProducts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { best_products: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BestProducts",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*best_products*/ ctx[0] === undefined && !('best_products' in props)) {
    			console.warn("<BestProducts> was created without expected prop 'best_products'");
    		}
    	}

    	get best_products() {
    		throw new Error("<BestProducts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set best_products(value) {
    		throw new Error("<BestProducts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductPreview.svelte generated by Svelte v3.46.4 */
    const file$g = "src\\components\\ProductPreview.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (25:4) {#if show}
    function create_if_block$a(ctx) {
    	let div20;
    	let div0;
    	let t0;
    	let div19;
    	let div1;
    	let i0;
    	let t1;
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;
    	let t2;
    	let t3;
    	let div18;
    	let div4;
    	let t4_value = /*product*/ ctx[2].title + ' ' + /*product*/ ctx[2].version + "";
    	let t4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;
    	let t7;
    	let b0;
    	let t8_value = /*product*/ ctx[2].producer + "";
    	let t8;
    	let t9;
    	let div7;
    	let t10;
    	let b1;
    	let t11_value = /*product*/ ctx[2].availability + "";
    	let t11;
    	let t12;
    	let div8;
    	let t13;
    	let b2;
    	let t15;
    	let div9;
    	let b3;
    	let t17;
    	let div10;
    	let form;
    	let t18;
    	let div16;
    	let div14;
    	let t19;
    	let t20;
    	let div13;
    	let div11;
    	let i1;
    	let t21;
    	let div12;
    	let i2;
    	let t22;
    	let div15;
    	let i3;
    	let t23;
    	let t24;
    	let div17;
    	let a;
    	let t25;
    	let a_href_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*product*/ ctx[2].discount_bollean && create_if_block_2$4(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*product*/ ctx[2].discount_bollean) return create_if_block_1$8;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let each_value = /*product*/ ctx[2].colors;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div19 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div18 = element("div");
    			div4 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div5 = element("div");
    			if_block1.c();
    			t6 = space();
    			div6 = element("div");
    			t7 = text("V??robca: ");
    			b0 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			div7 = element("div");
    			t10 = text("Dostupnos??: ");
    			b1 = element("b");
    			t11 = text(t11_value);
    			t12 = space();
    			div8 = element("div");
    			t13 = text("Typ produktu: ");
    			b2 = element("b");
    			b2.textContent = `${/*category*/ ctx[4][0].title}`;
    			t15 = space();
    			div9 = element("div");
    			b3 = element("b");
    			b3.textContent = "Farba:";
    			t17 = space();
    			div10 = element("div");
    			form = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			div16 = element("div");
    			div14 = element("div");
    			t19 = text(/*count*/ ctx[3]);
    			t20 = space();
    			div13 = element("div");
    			div11 = element("div");
    			i1 = element("i");
    			t21 = space();
    			div12 = element("div");
    			i2 = element("i");
    			t22 = space();
    			div15 = element("div");
    			i3 = element("i");
    			t23 = text(" Prida?? do ko????ka");
    			t24 = space();
    			div17 = element("div");
    			a = element("a");
    			t25 = text("alebo zobrazi?? cel?? n??h??ad");
    			attr_dev(div0, "class", "background svelte-19r32zk");
    			add_location(div0, file$g, 26, 12, 544);
    			attr_dev(i0, "class", "fas fa-times svelte-19r32zk");
    			add_location(i0, file$g, 28, 68, 679);
    			attr_dev(div1, "class", "quit svelte-19r32zk");
    			add_location(div1, file$g, 28, 16, 627);
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[2].image_urls[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-19r32zk");
    			add_location(img, file$g, 31, 24, 835);
    			attr_dev(div2, "class", "product-images svelte-19r32zk");
    			add_location(div2, file$g, 30, 20, 781);
    			attr_dev(div3, "class", "left-container svelte-19r32zk");
    			add_location(div3, file$g, 29, 16, 731);
    			attr_dev(div4, "class", "product-title svelte-19r32zk");
    			add_location(div4, file$g, 38, 20, 1152);
    			attr_dev(div5, "class", "price svelte-19r32zk");
    			add_location(div5, file$g, 39, 20, 1246);
    			add_location(b0, file$g, 47, 64, 1812);
    			attr_dev(div6, "class", "producer product-info svelte-19r32zk");
    			add_location(div6, file$g, 47, 20, 1768);
    			add_location(b1, file$g, 48, 71, 1916);
    			attr_dev(div7, "class", "availability product-info svelte-19r32zk");
    			add_location(div7, file$g, 48, 20, 1865);
    			add_location(b2, file$g, 49, 69, 2022);
    			attr_dev(div8, "class", "category product-info svelte-19r32zk");
    			add_location(div8, file$g, 49, 20, 1973);
    			add_location(b3, file$g, 50, 58, 2114);
    			attr_dev(div9, "class", "color-title product-info svelte-19r32zk");
    			add_location(div9, file$g, 50, 20, 2076);
    			attr_dev(form, "class", "svelte-19r32zk");
    			add_location(form, file$g, 52, 24, 2200);
    			attr_dev(div10, "class", "color svelte-19r32zk");
    			add_location(div10, file$g, 51, 20, 2155);
    			attr_dev(i1, "class", "fas fa-chevron-up svelte-19r32zk");
    			add_location(i1, file$g, 66, 86, 3100);
    			add_location(div11, file$g, 66, 32, 3046);
    			attr_dev(i2, "class", "fas fa-chevron-down svelte-19r32zk");
    			add_location(i2, file$g, 67, 85, 3226);
    			add_location(div12, file$g, 67, 32, 3173);
    			attr_dev(div13, "class", "counter-arrows svelte-19r32zk");
    			add_location(div13, file$g, 65, 28, 2984);
    			attr_dev(div14, "class", "counter svelte-19r32zk");
    			add_location(div14, file$g, 63, 24, 2896);
    			attr_dev(i3, "class", "fas fa-cart-plus svelte-19r32zk");
    			add_location(i3, file$g, 71, 28, 3471);
    			attr_dev(div15, "class", "add-to-card svelte-19r32zk");
    			add_location(div15, file$g, 70, 24, 3361);
    			attr_dev(div16, "class", "add-to-card-counter svelte-19r32zk");
    			add_location(div16, file$g, 62, 20, 2837);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[2].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[2].title + ' ' + /*product*/ ctx[2].version).toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "svelte-19r32zk");
    			add_location(a, file$g, 75, 24, 3656);
    			attr_dev(div17, "class", "show-full-view svelte-19r32zk");
    			add_location(div17, file$g, 74, 20, 3602);
    			attr_dev(div18, "class", "product-information svelte-19r32zk");
    			add_location(div18, file$g, 37, 16, 1097);
    			attr_dev(div19, "class", "preview svelte-19r32zk");
    			add_location(div19, file$g, 27, 12, 588);
    			attr_dev(div20, "class", "container-preview svelte-19r32zk");
    			add_location(div20, file$g, 25, 8, 499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div0);
    			append_dev(div20, t0);
    			append_dev(div20, div19);
    			append_dev(div19, div1);
    			append_dev(div1, i0);
    			append_dev(div19, t1);
    			append_dev(div19, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div19, t3);
    			append_dev(div19, div18);
    			append_dev(div18, div4);
    			append_dev(div4, t4);
    			append_dev(div18, t5);
    			append_dev(div18, div5);
    			if_block1.m(div5, null);
    			append_dev(div18, t6);
    			append_dev(div18, div6);
    			append_dev(div6, t7);
    			append_dev(div6, b0);
    			append_dev(b0, t8);
    			append_dev(div18, t9);
    			append_dev(div18, div7);
    			append_dev(div7, t10);
    			append_dev(div7, b1);
    			append_dev(b1, t11);
    			append_dev(div18, t12);
    			append_dev(div18, div8);
    			append_dev(div8, t13);
    			append_dev(div8, b2);
    			append_dev(div18, t15);
    			append_dev(div18, div9);
    			append_dev(div9, b3);
    			append_dev(div18, t17);
    			append_dev(div18, div10);
    			append_dev(div10, form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(div18, t18);
    			append_dev(div18, div16);
    			append_dev(div16, div14);
    			append_dev(div14, t19);
    			append_dev(div14, t20);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, i1);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			append_dev(div12, i2);
    			append_dev(div16, t22);
    			append_dev(div16, div15);
    			append_dev(div15, i3);
    			append_dev(div15, t23);
    			append_dev(div18, t24);
    			append_dev(div18, div17);
    			append_dev(div17, a);
    			append_dev(a, t25);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(div11, "click", /*click_handler_1*/ ctx[10], false, false, false),
    					listen_dev(div12, "click", /*click_handler_2*/ ctx[11], false, false, false),
    					listen_dev(
    						div15,
    						"click",
    						function () {
    							if (is_function(addToCart(/*product*/ ctx[2], /*selected_color*/ ctx[1], /*count*/ ctx[3]))) addToCart(/*product*/ ctx[2], /*selected_color*/ ctx[1], /*count*/ ctx[3]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*product*/ 4 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[2].image_urls[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*product*/ ctx[2].discount_bollean) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*product*/ 4 && t4_value !== (t4_value = /*product*/ ctx[2].title + ' ' + /*product*/ ctx[2].version + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, null);
    				}
    			}

    			if (dirty & /*product*/ 4 && t8_value !== (t8_value = /*product*/ ctx[2].producer + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*product*/ 4 && t11_value !== (t11_value = /*product*/ ctx[2].availability + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*product, selected_color*/ 6) {
    				each_value = /*product*/ ctx[2].colors;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*count*/ 8) set_data_dev(t19, /*count*/ ctx[3]);

    			if (dirty & /*product*/ 4 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[2].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[2].title + ' ' + /*product*/ ctx[2].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(25:4) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (33:24) {#if product.discount_bollean}
    function create_if_block_2$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Z??ava";
    			attr_dev(div, "class", "sale-box svelte-19r32zk");
    			add_location(div, file$g, 33, 28, 963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(33:24) {#if product.discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (44:24) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let t0_value = /*product*/ ctx[2].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			attr_dev(div, "class", "new-price svelte-19r32zk");
    			add_location(div, file$g, 44, 28, 1609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 4 && t0_value !== (t0_value = /*product*/ ctx[2].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(44:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:24) {#if product.discount_bollean}
    function create_if_block_1$8(ctx) {
    	let div0;
    	let t0_value = /*product*/ ctx[2].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*product*/ ctx[2].discount_price.toString().split('.').join(',') + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = text(" ???");
    			attr_dev(div0, "class", "old-price svelte-19r32zk");
    			add_location(div0, file$g, 41, 28, 1351);
    			attr_dev(div1, "class", "new-price svelte-19r32zk");
    			add_location(div1, file$g, 42, 28, 1459);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 4 && t0_value !== (t0_value = /*product*/ ctx[2].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*product*/ 4 && t3_value !== (t3_value = /*product*/ ctx[2].discount_price.toString().split('.').join(',') + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(41:24) {#if product.discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (54:28) {#each product.colors as color, i}
    function create_each_block$a(ctx) {
    	let label;
    	let div;
    	let t0_value = /*color*/ ctx[12].title + "";
    	let t0;
    	let i_1;
    	let t1;
    	let input;
    	let input_name_value;
    	let input_value_value;
    	let t2;
    	let span;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			t0 = text(t0_value);
    			i_1 = element("i");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			span = element("span");
    			t3 = space();
    			attr_dev(i_1, "class", "fas fa-caret-down arrow svelte-19r32zk");
    			add_location(i_1, file$g, 55, 74, 2422);
    			attr_dev(div, "class", "description svelte-19r32zk");
    			add_location(div, file$g, 55, 36, 2384);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", input_name_value = "color_" + /*product*/ ctx[2].id);
    			input.__value = input_value_value = /*color*/ ctx[12];
    			input.value = input.__value;
    			attr_dev(input, "class", "radio svelte-19r32zk");
    			/*$$binding_groups*/ ctx[9][0].push(input);
    			add_location(input, file$g, 56, 36, 2505);
    			attr_dev(span, "class", "design svelte-19r32zk");
    			add_location(span, file$g, 57, 36, 2647);
    			set_style(label, "--radio-color", /*color*/ ctx[12].hex);
    			attr_dev(label, "class", "svelte-19r32zk");
    			add_location(label, file$g, 54, 32, 2304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, t0);
    			append_dev(div, i_1);
    			append_dev(label, t1);
    			append_dev(label, input);
    			input.checked = input.__value === /*selected_color*/ ctx[1];
    			append_dev(label, t2);
    			append_dev(label, span);
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product*/ 4 && t0_value !== (t0_value = /*color*/ ctx[12].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*product*/ 4 && input_name_value !== (input_name_value = "color_" + /*product*/ ctx[2].id)) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*product*/ 4 && input_value_value !== (input_value_value = /*color*/ ctx[12])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*selected_color*/ 2) {
    				input.checked = input.__value === /*selected_color*/ ctx[1];
    			}

    			if (dirty & /*product*/ 4) {
    				set_style(label, "--radio-color", /*color*/ ctx[12].hex);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[9][0].splice(/*$$binding_groups*/ ctx[9][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(54:28) {#each product.colors as color, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let t;
    	let script;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[0] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t = space();
    			script = element("script");
    			add_location(script, file$g, 81, 4, 3959);
    			add_location(main, file$g, 23, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t);
    			append_dev(main, script);

    			if (!mounted) {
    				dispose = listen_dev(main, "load", /*hideProductPreview*/ ctx[5](), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(main, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductPreview', slots, []);
    	let { product } = $$props;
    	let { show } = $$props;
    	let { random_num } = $$props;
    	let { selected_color } = $$props;
    	let count = 1;
    	let category = categories.filter(x => x.id == product.category);

    	function hideProductPreview() {
    		$$invalidate(0, show = false);
    	}

    	const writable_props = ['product', 'show', 'random_num', 'selected_color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductPreview> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	const click_handler = () => {
    		$$invalidate(0, show = false);
    	};

    	function input_change_handler() {
    		selected_color = this.__value;
    		$$invalidate(1, selected_color);
    	}

    	const click_handler_1 = () => count < 10 ? $$invalidate(3, count += 1) : count;
    	const click_handler_2 = () => count > 1 ? $$invalidate(3, count -= 1) : count;

    	$$self.$$set = $$props => {
    		if ('product' in $$props) $$invalidate(2, product = $$props.product);
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(6, random_num = $$props.random_num);
    		if ('selected_color' in $$props) $$invalidate(1, selected_color = $$props.selected_color);
    	};

    	$$self.$capture_state = () => ({
    		categories,
    		addToCart,
    		product,
    		show,
    		random_num,
    		selected_color,
    		count,
    		category,
    		hideProductPreview
    	});

    	$$self.$inject_state = $$props => {
    		if ('product' in $$props) $$invalidate(2, product = $$props.product);
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(6, random_num = $$props.random_num);
    		if ('selected_color' in $$props) $$invalidate(1, selected_color = $$props.selected_color);
    		if ('count' in $$props) $$invalidate(3, count = $$props.count);
    		if ('category' in $$props) $$invalidate(4, category = $$props.category);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*random_num*/ 64) {
    			{
    				$$invalidate(0, show = true);
    			}
    		}
    	};

    	return [
    		show,
    		selected_color,
    		product,
    		count,
    		category,
    		hideProductPreview,
    		random_num,
    		click_handler,
    		input_change_handler,
    		$$binding_groups,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class ProductPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			product: 2,
    			show: 0,
    			random_num: 6,
    			selected_color: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductPreview",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*product*/ ctx[2] === undefined && !('product' in props)) {
    			console.warn("<ProductPreview> was created without expected prop 'product'");
    		}

    		if (/*show*/ ctx[0] === undefined && !('show' in props)) {
    			console.warn("<ProductPreview> was created without expected prop 'show'");
    		}

    		if (/*random_num*/ ctx[6] === undefined && !('random_num' in props)) {
    			console.warn("<ProductPreview> was created without expected prop 'random_num'");
    		}

    		if (/*selected_color*/ ctx[1] === undefined && !('selected_color' in props)) {
    			console.warn("<ProductPreview> was created without expected prop 'selected_color'");
    		}
    	}

    	get product() {
    		throw new Error("<ProductPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set product(value) {
    		throw new Error("<ProductPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<ProductPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<ProductPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get random_num() {
    		throw new Error("<ProductPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set random_num(value) {
    		throw new Error("<ProductPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected_color() {
    		throw new Error("<ProductPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected_color(value) {
    		throw new Error("<ProductPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Product.svelte generated by Svelte v3.46.4 */
    const file$f = "src\\components\\Product.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (30:20) {#if product.discount_bollean}
    function create_if_block_1$7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Z??ava";
    			attr_dev(div, "class", "sale-box svelte-lvnaf6");
    			add_location(div, file$f, 30, 24, 968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(30:20) {#if product.discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (49:20) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let t0_value = /*product*/ ctx[6].price.toFixed(2).toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			attr_dev(div, "class", "new-price svelte-lvnaf6");
    			add_location(div, file$f, 49, 24, 2665);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 1 && t0_value !== (t0_value = /*product*/ ctx[6].price.toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(49:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:20) {#if product.discount_bollean}
    function create_if_block$9(ctx) {
    	let div0;
    	let t0_value = /*product*/ ctx[6].price.toFixed(2).toString().split('.').join(',') + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*product*/ ctx[6].discount_price.toFixed(2).toString().split('.').join(',') + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = text(" ???");
    			attr_dev(div0, "class", "old-price svelte-lvnaf6");
    			add_location(div0, file$f, 46, 24, 2397);
    			attr_dev(div1, "class", "new-price svelte-lvnaf6");
    			add_location(div1, file$f, 47, 24, 2512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 1 && t0_value !== (t0_value = /*product*/ ctx[6].price.toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*products*/ 1 && t3_value !== (t3_value = /*product*/ ctx[6].discount_price.toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(46:20) {#if product.discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (26:8) {#each products as product}
    function create_each_block$9(ctx) {
    	let div12;
    	let div9;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t2;
    	let div8;
    	let div3;
    	let div2;
    	let t3;
    	let i0;
    	let i1;
    	let t4;
    	let div5;
    	let div4;
    	let t5;
    	let i2;
    	let i3;
    	let t6;
    	let div7;
    	let div6;
    	let t7;
    	let i4;
    	let i5;
    	let t8;
    	let a;
    	let div10;
    	let t9_value = /*product*/ ctx[6].title + "";
    	let t9;
    	let t10;
    	let t11_value = /*product*/ ctx[6].version + "";
    	let t11;
    	let a_href_value;
    	let t12;
    	let div11;
    	let t13;
    	let mounted;
    	let dispose;
    	let if_block0 = /*product*/ ctx[6].discount_bollean && create_if_block_1$7(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*product*/ ctx[6]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*product*/ ctx[6].discount_bollean) return create_if_block$9;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div9 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			img = element("img");
    			t2 = space();
    			div8 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			t3 = text("Prida?? do ko????ka");
    			i0 = element("i");
    			i1 = element("i");
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t5 = text("Prida?? do wishlistu");
    			i2 = element("i");
    			i3 = element("i");
    			t6 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t7 = text("Pozrie?? n??h??ad");
    			i4 = element("i");
    			i5 = element("i");
    			t8 = space();
    			a = element("a");
    			div10 = element("div");
    			t9 = text(t9_value);
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = space();
    			div11 = element("div");
    			if_block1.c();
    			t13 = space();
    			attr_dev(div0, "class", "image-box-background svelte-lvnaf6");
    			add_location(div0, file$f, 28, 20, 850);
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[6].image_urls[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[6].title);
    			attr_dev(img, "class", "svelte-lvnaf6");
    			add_location(img, file$f, 33, 24, 1101);
    			attr_dev(div1, "class", "product-img svelte-lvnaf6");
    			add_location(div1, file$f, 32, 20, 1050);
    			attr_dev(i0, "class", "fas fa-caret-down arrow svelte-lvnaf6");
    			add_location(i0, file$f, 36, 151, 1380);
    			attr_dev(div2, "class", "description svelte-lvnaf6");
    			add_location(div2, file$f, 36, 110, 1339);
    			attr_dev(i1, "class", "fas fa-cart-plus svelte-lvnaf6");
    			add_location(i1, file$f, 36, 196, 1425);
    			attr_dev(div3, "class", "add-to-basket link svelte-lvnaf6");
    			add_location(div3, file$f, 36, 24, 1253);
    			attr_dev(i2, "class", "fas fa-caret-down arrow svelte-lvnaf6");
    			add_location(i2, file$f, 37, 144, 1609);
    			attr_dev(div4, "class", "description svelte-lvnaf6");
    			add_location(div4, file$f, 37, 100, 1565);
    			attr_dev(i3, "class", "fas fa-heart svelte-lvnaf6");
    			add_location(i3, file$f, 37, 189, 1654);
    			attr_dev(div5, "class", "add-to-wishlist link svelte-lvnaf6");
    			add_location(div5, file$f, 37, 24, 1489);
    			attr_dev(i4, "class", "fas fa-caret-down arrow svelte-lvnaf6");
    			add_location(i4, file$f, 38, 138, 1828);
    			attr_dev(div6, "class", "description svelte-lvnaf6");
    			add_location(div6, file$f, 38, 99, 1789);
    			attr_dev(i5, "class", "fas fa-search-plus svelte-lvnaf6");
    			add_location(i5, file$f, 38, 183, 1873);
    			attr_dev(div7, "class", "show-details link svelte-lvnaf6");
    			add_location(div7, file$f, 38, 24, 1714);
    			attr_dev(div8, "class", "links svelte-lvnaf6");
    			add_location(div8, file$f, 35, 20, 1208);
    			attr_dev(div9, "class", "image-box svelte-lvnaf6");
    			add_location(div9, file$f, 27, 16, 805);
    			attr_dev(div10, "class", "product-title svelte-lvnaf6");
    			add_location(div10, file$f, 42, 20, 2194);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[6].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version).toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "product-link svelte-lvnaf6");
    			add_location(a, file$f, 41, 16, 1983);
    			attr_dev(div11, "class", "price svelte-lvnaf6");
    			add_location(div11, file$f, 44, 16, 2300);
    			attr_dev(div12, "class", "product svelte-lvnaf6");
    			add_location(div12, file$f, 26, 12, 766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div9);
    			append_dev(div9, div0);
    			append_dev(div9, t0);
    			if (if_block0) if_block0.m(div9, null);
    			append_dev(div9, t1);
    			append_dev(div9, div1);
    			append_dev(div1, img);
    			append_dev(div9, t2);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div2, i0);
    			append_dev(div3, i1);
    			append_dev(div8, t4);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div4, t5);
    			append_dev(div4, i2);
    			append_dev(div5, i3);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, t7);
    			append_dev(div6, i4);
    			append_dev(div7, i5);
    			append_dev(div12, t8);
    			append_dev(div12, a);
    			append_dev(a, div10);
    			append_dev(div10, t9);
    			append_dev(div10, t10);
    			append_dev(div10, t11);
    			append_dev(div12, t12);
    			append_dev(div12, div11);
    			if_block1.m(div11, null);
    			append_dev(div12, t13);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div3,
    						"click",
    						function () {
    							if (is_function(addToCart(/*product*/ ctx[6], /*product*/ ctx[6].colors[0], 1))) addToCart(/*product*/ ctx[6], /*product*/ ctx[6].colors[0], 1).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div5, "click", click_handler, false, false, false),
    					listen_dev(
    						div7,
    						"click",
    						function () {
    							if (is_function(/*showProductPreview*/ ctx[4](/*product*/ ctx[6].id))) /*showProductPreview*/ ctx[4](/*product*/ ctx[6].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*product*/ ctx[6].discount_bollean) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					if_block0.m(div9, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*products*/ 1 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[6].image_urls[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*products*/ 1 && img_alt_value !== (img_alt_value = /*product*/ ctx[6].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*products*/ 1 && t9_value !== (t9_value = /*product*/ ctx[6].title + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*products*/ 1 && t11_value !== (t11_value = /*product*/ ctx[6].version + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*products*/ 1 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[6].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div11, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(26:8) {#each products as product}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let productpreview;
    	let t;
    	let div;
    	let current;

    	productpreview = new ProductPreview({
    			props: {
    				product: products[/*product_index*/ ctx[3]],
    				show: /*show*/ ctx[1],
    				random_num: /*random_num*/ ctx[2],
    				selected_color: products[/*product_index*/ ctx[3]].colors[0]
    			},
    			$$inline: true
    		});

    	let each_value = /*products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(productpreview.$$.fragment);
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "products container svelte-lvnaf6");
    			add_location(div, file$f, 24, 4, 683);
    			add_location(main, file$f, 21, 0, 527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(productpreview, main, null);
    			append_dev(main, t);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const productpreview_changes = {};
    			if (dirty & /*product_index*/ 8) productpreview_changes.product = products[/*product_index*/ ctx[3]];
    			if (dirty & /*show*/ 2) productpreview_changes.show = /*show*/ ctx[1];
    			if (dirty & /*random_num*/ 4) productpreview_changes.random_num = /*random_num*/ ctx[2];
    			if (dirty & /*product_index*/ 8) productpreview_changes.selected_color = products[/*product_index*/ ctx[3]].colors[0];
    			productpreview.$set(productpreview_changes);

    			if (dirty & /*products, categories, showProductPreview, addToWishlist, addToCart*/ 17) {
    				each_value = /*products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(productpreview);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Product', slots, []);
    	let { products: products$1 } = $$props;
    	let show = false;
    	let random_num = Math.random();
    	let product_index = 0;

    	function showProductPreview(index) {
    		$$invalidate(3, product_index = index);
    		$$invalidate(1, show = true);
    		$$invalidate(2, random_num = Math.random());
    	}

    	const writable_props = ['products'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	const click_handler = product => addToWishlist(product);

    	$$self.$$set = $$props => {
    		if ('products' in $$props) $$invalidate(0, products$1 = $$props.products);
    	};

    	$$self.$capture_state = () => ({
    		categories,
    		allProducts: products,
    		products: products$1,
    		ProductPreview,
    		addToCart,
    		addToWishlist,
    		show,
    		random_num,
    		product_index,
    		showProductPreview
    	});

    	$$self.$inject_state = $$props => {
    		if ('products' in $$props) $$invalidate(0, products$1 = $$props.products);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(2, random_num = $$props.random_num);
    		if ('product_index' in $$props) $$invalidate(3, product_index = $$props.product_index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [products$1, show, random_num, product_index, showProductPreview, click_handler];
    }

    class Product$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { products: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*products*/ ctx[0] === undefined && !('products' in props)) {
    			console.warn("<Product> was created without expected prop 'products'");
    		}
    	}

    	get products() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set products(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Shop.svelte generated by Svelte v3.46.4 */
    const file$e = "src\\routes\\Shop.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (30:12) {#each categories as category}
    function create_each_block$8(ctx) {
    	let a;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t1_value = /*category*/ ctx[1].title + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = /*category*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*category*/ ctx[1].title);
    			attr_dev(img, "class", "svelte-djqugr");
    			add_location(img, file$e, 33, 28, 1187);
    			attr_dev(div0, "class", "category-image svelte-djqugr");
    			add_location(div0, file$e, 32, 24, 1129);
    			attr_dev(div1, "class", "category-title svelte-djqugr");
    			add_location(div1, file$e, 35, 24, 1296);
    			attr_dev(div2, "class", "category-card svelte-djqugr");
    			add_location(div2, file$e, 31, 20, 1076);
    			attr_dev(a, "href", "#/obchod/" + /*category*/ ctx[1].title.toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "category-card-a svelte-djqugr");
    			add_location(a, file$e, 30, 16, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(a, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(30:12) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t0;
    	let main;
    	let div1;
    	let div0;
    	let a;
    	let t2;
    	let span;
    	let t4;
    	let bestproducts;
    	let t5;
    	let div11;
    	let div2;
    	let t7;
    	let div5;
    	let div3;
    	let t8;
    	let div4;
    	let t9;
    	let div6;
    	let t10;
    	let sale;
    	let t11;
    	let div7;
    	let t13;
    	let div10;
    	let div8;
    	let t14;
    	let div9;
    	let t15;
    	let div12;
    	let product;
    	let current;

    	bestproducts = new BestProducts({
    			props: {
    				best_products: [products[0], products[10]]
    			},
    			$$inline: true
    		});

    	let each_value = categories;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	sale = new Sale({
    			props: { shop_now_btn: false },
    			$$inline: true
    		});

    	product = new Product$1({
    			props: { products: /*most_sold_products*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "Domov";
    			t2 = text(" / ");
    			span = element("span");
    			span.textContent = "Obchod";
    			t4 = space();
    			create_component(bestproducts.$$.fragment);
    			t5 = space();
    			div11 = element("div");
    			div2 = element("div");
    			div2.textContent = "Kateg??rie";
    			t7 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t8 = space();
    			div4 = element("div");
    			t9 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			create_component(sale.$$.fragment);
    			t11 = space();
    			div7 = element("div");
    			div7.textContent = "Najpredavanej??ie";
    			t13 = space();
    			div10 = element("div");
    			div8 = element("div");
    			t14 = space();
    			div9 = element("div");
    			t15 = space();
    			div12 = element("div");
    			create_component(product.$$.fragment);
    			document.title = "N???? obchod";
    			attr_dev(a, "href", "./#");
    			add_location(a, file$e, 18, 12, 515);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$e, 18, 38, 541);
    			attr_dev(div0, "class", "nav svelte-djqugr");
    			add_location(div0, file$e, 17, 8, 484);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$e, 16, 4, 451);
    			attr_dev(div2, "class", "title svelte-djqugr");
    			add_location(div2, file$e, 23, 8, 708);
    			attr_dev(div3, "class", "line svelte-djqugr");
    			add_location(div3, file$e, 25, 12, 785);
    			attr_dev(div4, "class", "line svelte-djqugr");
    			add_location(div4, file$e, 26, 12, 823);
    			attr_dev(div5, "class", "lines svelte-djqugr");
    			add_location(div5, file$e, 24, 8, 752);
    			attr_dev(div6, "class", "categories svelte-djqugr");
    			add_location(div6, file$e, 28, 8, 873);
    			attr_dev(div7, "class", "title svelte-djqugr");
    			add_location(div7, file$e, 41, 8, 1481);
    			attr_dev(div8, "class", "line svelte-djqugr");
    			add_location(div8, file$e, 43, 12, 1565);
    			attr_dev(div9, "class", "line svelte-djqugr");
    			add_location(div9, file$e, 44, 12, 1603);
    			attr_dev(div10, "class", "lines svelte-djqugr");
    			add_location(div10, file$e, 42, 8, 1532);
    			attr_dev(div11, "class", "container");
    			add_location(div11, file$e, 22, 4, 675);
    			attr_dev(div12, "class", "container");
    			add_location(div12, file$e, 47, 4, 1661);
    			attr_dev(main, "class", "svelte-djqugr");
    			add_location(main, file$e, 15, 0, 439);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div0, t2);
    			append_dev(div0, span);
    			append_dev(main, t4);
    			mount_component(bestproducts, main, null);
    			append_dev(main, t5);
    			append_dev(main, div11);
    			append_dev(div11, div2);
    			append_dev(div11, t7);
    			append_dev(div11, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div11, t9);
    			append_dev(div11, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			append_dev(div11, t10);
    			mount_component(sale, div11, null);
    			append_dev(div11, t11);
    			append_dev(div11, div7);
    			append_dev(div11, t13);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(main, t15);
    			append_dev(main, div12);
    			mount_component(product, div12, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*categories*/ 0) {
    				each_value = categories;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bestproducts.$$.fragment, local);
    			transition_in(sale.$$.fragment, local);
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bestproducts.$$.fragment, local);
    			transition_out(sale.$$.fragment, local);
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(bestproducts);
    			destroy_each(each_blocks, detaching);
    			destroy_component(sale);
    			destroy_component(product);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Shop', slots, []);
    	let most_sold_products = [products[3], products[12], products[23], products[37]];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Shop> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		products,
    		categories,
    		BestProducts,
    		Sale,
    		Product: Product$1,
    		most_sold_products
    	});

    	$$self.$inject_state = $$props => {
    		if ('most_sold_products' in $$props) $$invalidate(0, most_sold_products = $$props.most_sold_products);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [most_sold_products];
    }

    class Shop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Shop",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\routes\Products.svelte generated by Svelte v3.46.4 */
    const file$d = "src\\routes\\Products.svelte";

    function create_fragment$d(ctx) {
    	let title_value;
    	let t0;
    	let main;
    	let div3;
    	let div0;
    	let t2;
    	let div1;
    	let a0;
    	let t4;
    	let a1;
    	let t6;
    	let span;
    	let t8;
    	let div2;
    	let form;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t14;
    	let product;
    	let current;
    	let mounted;
    	let dispose;
    	document.title = title_value = /*category*/ ctx[2][0].title;

    	product = new Product$1({
    			props: { products: /*products_filtered*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*category*/ ctx[2][0].title}`;
    			t2 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Domov";
    			t4 = text(" / ");
    			a1 = element("a");
    			a1.textContent = "Obchod";
    			t6 = text(" / ");
    			span = element("span");
    			span.textContent = `${/*category*/ ctx[2][0].title}`;
    			t8 = space();
    			div2 = element("div");
    			form = element("form");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Zoradi?? pod??a: odpor????an??";
    			option1 = element("option");
    			option1.textContent = "Zoradi?? pod??a: najlacnej??ie";
    			option2 = element("option");
    			option2.textContent = "Zoradi?? pod??a: najdrah??ie";
    			option3 = element("option");
    			option3.textContent = "Zoradi?? pod??a: od A po Z";
    			option4 = element("option");
    			option4.textContent = "Zoradi?? pod??a: od Z po A";
    			t14 = space();
    			create_component(product.$$.fragment);
    			attr_dev(div0, "class", "title svelte-s6kyry");
    			add_location(div0, file$d, 49, 8, 1907);
    			attr_dev(a0, "href", "./#");
    			add_location(a0, file$d, 51, 12, 1992);
    			attr_dev(a1, "href", "./#/obchod");
    			add_location(a1, file$d, 51, 38, 2018);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$d, 51, 72, 2052);
    			attr_dev(div1, "class", "nav svelte-s6kyry");
    			add_location(div1, file$d, 50, 8, 1961);
    			option0.__value = "1";
    			option0.value = option0.__value;
    			add_location(option0, file$d, 56, 20, 2276);
    			option1.__value = "2";
    			option1.value = option1.__value;
    			add_location(option1, file$d, 57, 20, 2350);
    			option2.__value = "3";
    			option2.value = option2.__value;
    			add_location(option2, file$d, 58, 20, 2426);
    			option3.__value = "4";
    			option3.value = option3.__value;
    			add_location(option3, file$d, 59, 20, 2500);
    			option4.__value = "5";
    			option4.value = option4.__value;
    			add_location(option4, file$d, 60, 20, 2573);
    			attr_dev(select, "class", "svelte-s6kyry");
    			if (/*selected*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$d, 55, 16, 2224);
    			attr_dev(form, "class", "svelte-s6kyry");
    			add_location(form, file$d, 54, 12, 2157);
    			attr_dev(div2, "class", "filter");
    			add_location(div2, file$d, 53, 8, 2123);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$d, 48, 4, 1874);
    			attr_dev(main, "class", "svelte-s6kyry");
    			add_location(main, file$d, 47, 0, 1862);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(div1, t6);
    			append_dev(div1, span);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			select_option(select, /*selected*/ ctx[1]);
    			append_dev(div3, t14);
    			mount_component(product, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
    					listen_dev(form, "change", prevent_default(/*changedOption*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*category*/ 4) && title_value !== (title_value = /*category*/ ctx[2][0].title)) {
    				document.title = title_value;
    			}

    			if (dirty & /*selected*/ 2) {
    				select_option(select, /*selected*/ ctx[1]);
    			}

    			const product_changes = {};
    			if (dirty & /*products_filtered*/ 1) product_changes.products = /*products_filtered*/ ctx[0];
    			product.$set(product_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(product);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Products', slots, []);
    	let { params = {} } = $$props;
    	let category = categories.filter(x => x.title.toLowerCase() == params.category.split('_').join(' '));

    	if (category.length == 0) {
    		location.replace("#/NotFound");
    	}

    	let products_filtered = products.filter(x => x.category == category[0].id);
    	let selected;

    	function changedOption() {
    		if (selected == "1") {
    			$$invalidate(0, products_filtered = products_filtered.sort((a, b) => a.id > b.id ? 1 : a.id === b.id ? 1 : -1));
    		} else if (selected == "2") {
    			$$invalidate(0, products_filtered = products_filtered.sort((a, b) => (a.discount_bollean ? a.discount_price : a.price) > (b.discount_bollean ? b.discount_price : b.price)
    			? 1
    			: (a.discount_bollean ? a.discount_price : a.price) === (b.discount_bollean ? b.discount_price : b.price)
    				? 1
    				: -1));
    		} else if (selected == "3") {
    			$$invalidate(0, products_filtered = products_filtered.sort((a, b) => (a.discount_bollean ? a.discount_price : a.price) < (b.discount_bollean ? b.discount_price : b.price)
    			? 1
    			: (a.discount_bollean ? a.discount_price : a.price) === (b.discount_bollean ? b.discount_price : b.price)
    				? 1
    				: -1));
    		} else if (selected == "4") {
    			$$invalidate(0, products_filtered = products_filtered.sort((a, b) => a.title > b.title ? 1 : a.title === b.title ? 1 : -1));
    		} else if (selected == "5") {
    			$$invalidate(0, products_filtered = products_filtered.sort((a, b) => a.title < b.title ? 1 : a.title === b.title ? 1 : -1));
    		}
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Products> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate(1, selected);
    	}

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Product: Product$1,
    		products,
    		categories,
    		params,
    		category,
    		products_filtered,
    		selected,
    		changedOption
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(4, params = $$props.params);
    		if ('category' in $$props) $$invalidate(2, category = $$props.category);
    		if ('products_filtered' in $$props) $$invalidate(0, products_filtered = $$props.products_filtered);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*products_filtered*/ 1) ;
    	};

    	return [
    		products_filtered,
    		selected,
    		category,
    		changedOption,
    		params,
    		select_change_handler
    	];
    }

    class Products extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { params: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Products",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get params() {
    		throw new Error("<Products>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Products>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Gallery.svelte generated by Svelte v3.46.4 */

    const file$c = "src\\components\\Gallery.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (16:4) {#if show}
    function create_if_block$8(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let t2_value = /*active_img*/ ctx[0] + 1 + "";
    	let t2;
    	let t3;
    	let t4_value = /*images*/ ctx[2].length + "";
    	let t4;
    	let t5;
    	let div1;
    	let i;
    	let t6;
    	let div4;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t7;
    	let div3;
    	let t8;
    	let div5;
    	let mounted;
    	let dispose;
    	let if_block = /*images*/ ctx[2].length > 1 && create_if_block_1$6(ctx);
    	let each_value = /*images*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(/*product_title*/ ctx[3]);
    			t1 = text(": Obr??zok: ");
    			t2 = text(t2_value);
    			t3 = text(" / ");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			i = element("i");
    			t6 = space();
    			div4 = element("div");
    			img = element("img");
    			t7 = space();
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t8 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "title-gallery");
    			add_location(div0, file$c, 18, 16, 395);
    			attr_dev(i, "class", "fas fa-times");
    			add_location(i, file$c, 19, 67, 557);
    			attr_dev(div1, "class", "quit-gallery svelte-p9zz66");
    			add_location(div1, file$c, 19, 16, 506);
    			attr_dev(div2, "class", "top-bar svelte-p9zz66");
    			add_location(div2, file$c, 17, 12, 356);
    			if (!src_url_equal(img.src, img_src_value = /*images*/ ctx[2][/*active_img*/ ctx[0]])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "" + (/*product_title*/ ctx[3] + ", obr??zok: " + (/*active_img*/ ctx[0] + 1) + " / " + /*images*/ ctx[2].length));
    			attr_dev(img, "class", "svelte-p9zz66");
    			add_location(img, file$c, 22, 16, 673);
    			attr_dev(div3, "class", "arrows svelte-p9zz66");
    			add_location(div3, file$c, 23, 16, 790);
    			attr_dev(div4, "class", "main-img-gallery svelte-p9zz66");
    			add_location(div4, file$c, 21, 12, 625);
    			attr_dev(div5, "class", "small-images-gallery svelte-p9zz66");
    			add_location(div5, file$c, 30, 12, 1289);
    			attr_dev(div6, "class", "container-gallery svelte-p9zz66");
    			add_location(div6, file$c, 16, 8, 311);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, i);
    			append_dev(div6, t6);
    			append_dev(div6, div4);
    			append_dev(div4, img);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div6, t8);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*hideGallery*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*product_title*/ 8) set_data_dev(t0, /*product_title*/ ctx[3]);
    			if (dirty & /*active_img*/ 1 && t2_value !== (t2_value = /*active_img*/ ctx[0] + 1 + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*images*/ 4 && t4_value !== (t4_value = /*images*/ ctx[2].length + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*images, active_img*/ 5 && !src_url_equal(img.src, img_src_value = /*images*/ ctx[2][/*active_img*/ ctx[0]])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product_title, active_img, images*/ 13 && img_alt_value !== (img_alt_value = "" + (/*product_title*/ ctx[3] + ", obr??zok: " + (/*active_img*/ ctx[0] + 1) + " / " + /*images*/ ctx[2].length))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (/*images*/ ctx[2].length > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*active_img, images, product_title*/ 13) {
    				each_value = /*images*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(16:4) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (25:20) {#if images.length > 1}
    function create_if_block_1$6(ctx) {
    	let i0;
    	let i0_class_value;
    	let t;
    	let i1;
    	let i1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			i0 = element("i");
    			t = space();
    			i1 = element("i");
    			attr_dev(i0, "class", i0_class_value = "fas fa-chevron-left " + (/*active_img*/ ctx[0] == 0 ? 'active' : '') + " svelte-p9zz66");
    			add_location(i0, file$c, 25, 20, 877);

    			attr_dev(i1, "class", i1_class_value = "fas fa-chevron-right " + (/*active_img*/ ctx[0] == /*images*/ ctx[2].length - 1
    			? 'active'
    			: '') + " svelte-p9zz66");

    			add_location(i1, file$c, 26, 20, 1033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, i1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(i0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(i1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*active_img*/ 1 && i0_class_value !== (i0_class_value = "fas fa-chevron-left " + (/*active_img*/ ctx[0] == 0 ? 'active' : '') + " svelte-p9zz66")) {
    				attr_dev(i0, "class", i0_class_value);
    			}

    			if (dirty & /*active_img, images*/ 5 && i1_class_value !== (i1_class_value = "fas fa-chevron-right " + (/*active_img*/ ctx[0] == /*images*/ ctx[2].length - 1
    			? 'active'
    			: '') + " svelte-p9zz66")) {
    				attr_dev(i1, "class", i1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(i1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(25:20) {#if images.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (32:16) {#each images as img, i}
    function create_each_block$7(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[8](/*i*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*img*/ ctx[9])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = "" + (/*product_title*/ ctx[3] + ", obr??zok: " + (/*i*/ ctx[11] + 1) + " / " + /*images*/ ctx[2].length));
    			attr_dev(img, "class", "svelte-p9zz66");
    			add_location(img, file$c, 33, 24, 1504);
    			attr_dev(div, "class", div_class_value = "small-img " + (/*active_img*/ ctx[0] == /*i*/ ctx[11] ? 'active' : '') + " svelte-p9zz66");
    			add_location(div, file$c, 32, 20, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*images*/ 4 && !src_url_equal(img.src, img_src_value = /*img*/ ctx[9])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*product_title, images*/ 12 && img_alt_value !== (img_alt_value = "" + (/*product_title*/ ctx[3] + ", obr??zok: " + (/*i*/ ctx[11] + 1) + " / " + /*images*/ ctx[2].length))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*active_img*/ 1 && div_class_value !== (div_class_value = "small-img " + (/*active_img*/ ctx[0] == /*i*/ ctx[11] ? 'active' : '') + " svelte-p9zz66")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(32:16) {#each images as img, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[1] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			add_location(main, file$c, 14, 0, 253);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);

    			if (!mounted) {
    				dispose = listen_dev(main, "load", /*hideGallery*/ ctx[4](), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let { active_img } = $$props;
    	let { show } = $$props;
    	let { random_num } = $$props;
    	let { images } = $$props;
    	let { product_title } = $$props;

    	function hideGallery() {
    		$$invalidate(1, show = false);
    	}

    	const writable_props = ['active_img', 'show', 'random_num', 'images', 'product_title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => active_img > 0
    	? $$invalidate(0, active_img -= 1)
    	: active_img;

    	const click_handler_1 = () => active_img < images.length - 1
    	? $$invalidate(0, active_img += 1)
    	: active_img;

    	const click_handler_2 = i => $$invalidate(0, active_img = i);

    	$$self.$$set = $$props => {
    		if ('active_img' in $$props) $$invalidate(0, active_img = $$props.active_img);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(5, random_num = $$props.random_num);
    		if ('images' in $$props) $$invalidate(2, images = $$props.images);
    		if ('product_title' in $$props) $$invalidate(3, product_title = $$props.product_title);
    	};

    	$$self.$capture_state = () => ({
    		active_img,
    		show,
    		random_num,
    		images,
    		product_title,
    		hideGallery
    	});

    	$$self.$inject_state = $$props => {
    		if ('active_img' in $$props) $$invalidate(0, active_img = $$props.active_img);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(5, random_num = $$props.random_num);
    		if ('images' in $$props) $$invalidate(2, images = $$props.images);
    		if ('product_title' in $$props) $$invalidate(3, product_title = $$props.product_title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*random_num*/ 32) {
    			{
    				$$invalidate(1, show = true);
    			}
    		}
    	};

    	return [
    		active_img,
    		show,
    		images,
    		product_title,
    		hideGallery,
    		random_num,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			active_img: 0,
    			show: 1,
    			random_num: 5,
    			images: 2,
    			product_title: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active_img*/ ctx[0] === undefined && !('active_img' in props)) {
    			console.warn("<Gallery> was created without expected prop 'active_img'");
    		}

    		if (/*show*/ ctx[1] === undefined && !('show' in props)) {
    			console.warn("<Gallery> was created without expected prop 'show'");
    		}

    		if (/*random_num*/ ctx[5] === undefined && !('random_num' in props)) {
    			console.warn("<Gallery> was created without expected prop 'random_num'");
    		}

    		if (/*images*/ ctx[2] === undefined && !('images' in props)) {
    			console.warn("<Gallery> was created without expected prop 'images'");
    		}

    		if (/*product_title*/ ctx[3] === undefined && !('product_title' in props)) {
    			console.warn("<Gallery> was created without expected prop 'product_title'");
    		}
    	}

    	get active_img() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active_img(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get random_num() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set random_num(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get images() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get product_title() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set product_title(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Product.svelte generated by Svelte v3.46.4 */
    const file$b = "src\\routes\\Product.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (66:20) {#if product[0].discount_bollean}
    function create_if_block_2$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Z??ava";
    			attr_dev(div, "class", "sale-box svelte-v9nuel");
    			add_location(div, file$b, 66, 24, 2275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(66:20) {#if product[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (72:20) {#if product[0].image_urls.length > 1}
    function create_if_block_1$5(ctx) {
    	let i0;
    	let i0_class_value;
    	let t;
    	let i1;
    	let i1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			i0 = element("i");
    			t = space();
    			i1 = element("i");
    			attr_dev(i0, "class", i0_class_value = "fas fa-chevron-left " + (/*img*/ ctx[5] == 0 ? 'active' : '') + " svelte-v9nuel");
    			add_location(i0, file$b, 72, 20, 2572);

    			attr_dev(i1, "class", i1_class_value = "fas fa-chevron-right " + (/*img*/ ctx[5] == /*product*/ ctx[7][0].image_urls.length - 1
    			? 'active'
    			: '') + " svelte-v9nuel");

    			add_location(i1, file$b, 73, 20, 2700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, i1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(i0, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(i1, "click", /*click_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*img*/ 32 && i0_class_value !== (i0_class_value = "fas fa-chevron-left " + (/*img*/ ctx[5] == 0 ? 'active' : '') + " svelte-v9nuel")) {
    				attr_dev(i0, "class", i0_class_value);
    			}

    			if (dirty & /*img*/ 32 && i1_class_value !== (i1_class_value = "fas fa-chevron-right " + (/*img*/ ctx[5] == /*product*/ ctx[7][0].image_urls.length - 1
    			? 'active'
    			: '') + " svelte-v9nuel")) {
    				attr_dev(i1, "class", i1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(i1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(72:20) {#if product[0].image_urls.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (84:20) {:else}
    function create_else_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${/*product*/ ctx[7][0].price.toFixed(2).toString().split('.').join(',')} ???`;
    			attr_dev(div, "class", "new-price svelte-v9nuel");
    			add_location(div, file$b, 84, 24, 3479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(84:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:20) {#if product[0].discount_bollean}
    function create_if_block$7(ctx) {
    	let div0;
    	let t2;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = `${/*product*/ ctx[7][0].price.toFixed(2).toString().split('.').join(',')} ???`;
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = `${/*product*/ ctx[7][0].discount_price.toFixed(2).toString().split('.').join(',')} ???`;
    			attr_dev(div0, "class", "old-price svelte-v9nuel");
    			add_location(div0, file$b, 81, 24, 3205);
    			attr_dev(div1, "class", "new-price svelte-v9nuel");
    			add_location(div1, file$b, 82, 24, 3323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(81:20) {#if product[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (97:32) {#each product[0].colors as color}
    function create_each_block$6(ctx) {
    	let label;
    	let div;
    	let t0_value = /*color*/ ctx[17].title + "";
    	let t0;
    	let i;
    	let t1;
    	let input;
    	let t2;
    	let span;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			t0 = text(t0_value);
    			i = element("i");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			span = element("span");
    			t3 = space();
    			attr_dev(i, "class", "fas fa-caret-down arrow svelte-v9nuel");
    			add_location(i, file$b, 98, 78, 4491);
    			attr_dev(div, "class", "description svelte-v9nuel");
    			add_location(div, file$b, 98, 40, 4453);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "color");
    			input.__value = /*color*/ ctx[17];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-v9nuel");
    			/*$$binding_groups*/ ctx[12][0].push(input);
    			add_location(input, file$b, 99, 40, 4578);
    			attr_dev(span, "class", "design svelte-v9nuel");
    			add_location(span, file$b, 100, 40, 4697);
    			set_style(label, "--radio-color", /*color*/ ctx[17].hex);
    			attr_dev(label, "class", "svelte-v9nuel");
    			add_location(label, file$b, 97, 36, 4369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, t0);
    			append_dev(div, i);
    			append_dev(label, t1);
    			append_dev(label, input);
    			input.checked = input.__value === /*selected_color*/ ctx[3];
    			append_dev(label, t2);
    			append_dev(label, span);
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selected_color*/ 8) {
    				input.checked = input.__value === /*selected_color*/ ctx[3];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[12][0].splice(/*$$binding_groups*/ ctx[12][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(97:32) {#each product[0].colors as color}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let title_value;
    	let t0;
    	let main;
    	let gallery;
    	let t1;
    	let div2;
    	let div0;
    	let t3;
    	let div1;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let a2;
    	let t8_value = /*category*/ ctx[6][0].title + "";
    	let t8;
    	let a2_href_value;
    	let t9;
    	let span;
    	let t11;
    	let div36;
    	let div29;
    	let div6;
    	let div4;
    	let img_1;
    	let img_1_src_value;
    	let t12;
    	let t13;
    	let div3;
    	let t14_value = /*img*/ ctx[5] + 1 + "";
    	let t14;
    	let t15;
    	let t16_value = /*product*/ ctx[7][0].image_urls.length + "";
    	let t16;
    	let t17;
    	let div5;
    	let t18;
    	let div28;
    	let div7;
    	let t20;
    	let div8;
    	let t21;
    	let div9;
    	let t23;
    	let div27;
    	let div15;
    	let div10;
    	let t24;
    	let b0;
    	let t26;
    	let div11;
    	let t27;
    	let b1;
    	let t29;
    	let div12;
    	let t30;
    	let b2;
    	let t32;
    	let div13;
    	let b3;
    	let t34;
    	let div14;
    	let form;
    	let t35;
    	let div26;
    	let div18;
    	let div16;
    	let a3;
    	let i0;
    	let t36;
    	let t37;
    	let div17;
    	let a4;
    	let i1;
    	let t38;
    	let t39;
    	let div24;
    	let div22;
    	let t40;
    	let t41;
    	let div21;
    	let div19;
    	let i2;
    	let t42;
    	let div20;
    	let i3;
    	let t43;
    	let div23;
    	let i4;
    	let t44;
    	let t45;
    	let div25;
    	let i5;
    	let t46;
    	let t47;
    	let div35;
    	let div30;
    	let t49;
    	let div33;
    	let div31;
    	let t50;
    	let div32;
    	let t51;
    	let div34;
    	let current;
    	let mounted;
    	let dispose;
    	document.title = title_value = /*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version;

    	gallery = new Gallery({
    			props: {
    				active_img: /*img*/ ctx[5],
    				show: /*show*/ ctx[1],
    				random_num: /*random_num*/ ctx[2],
    				images: /*product*/ ctx[7][0].image_urls,
    				product_title: /*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version
    			},
    			$$inline: true
    		});

    	let if_block0 = /*product*/ ctx[7][0].discount_bollean && create_if_block_2$3(ctx);
    	let if_block1 = /*product*/ ctx[7][0].image_urls.length > 1 && create_if_block_1$5(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*product*/ ctx[7][0].discount_bollean) return create_if_block$7;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block2 = current_block_type(ctx);
    	let each_value = /*product*/ ctx[7][0].colors;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			create_component(gallery.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = `${/*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version}`;
    			t3 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Domov";
    			t5 = text(" / ");
    			a1 = element("a");
    			a1.textContent = "Obchod";
    			t7 = text(" / ");
    			a2 = element("a");
    			t8 = text(t8_value);
    			t9 = text(" / ");
    			span = element("span");
    			span.textContent = `${/*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version}`;
    			t11 = space();
    			div36 = element("div");
    			div29 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			img_1 = element("img");
    			t12 = space();
    			if (if_block0) if_block0.c();
    			t13 = space();
    			div3 = element("div");
    			t14 = text(t14_value);
    			t15 = text(" / ");
    			t16 = text(t16_value);
    			t17 = space();
    			div5 = element("div");
    			if (if_block1) if_block1.c();
    			t18 = space();
    			div28 = element("div");
    			div7 = element("div");
    			div7.textContent = `${/*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version}`;
    			t20 = space();
    			div8 = element("div");
    			if_block2.c();
    			t21 = space();
    			div9 = element("div");
    			div9.textContent = `${/*product*/ ctx[7][0].short_description}`;
    			t23 = space();
    			div27 = element("div");
    			div15 = element("div");
    			div10 = element("div");
    			t24 = text("V??robca: ");
    			b0 = element("b");
    			b0.textContent = `${/*product*/ ctx[7][0].producer}`;
    			t26 = space();
    			div11 = element("div");
    			t27 = text("Dostupnos??: ");
    			b1 = element("b");
    			b1.textContent = `${/*product*/ ctx[7][0].availability}`;
    			t29 = space();
    			div12 = element("div");
    			t30 = text("Typ produktu: ");
    			b2 = element("b");
    			b2.textContent = `${/*category*/ ctx[6][0].title}`;
    			t32 = space();
    			div13 = element("div");
    			b3 = element("b");
    			b3.textContent = "Farba:";
    			t34 = space();
    			div14 = element("div");
    			form = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t35 = space();
    			div26 = element("div");
    			div18 = element("div");
    			div16 = element("div");
    			a3 = element("a");
    			i0 = element("i");
    			t36 = text(" Doprava");
    			t37 = space();
    			div17 = element("div");
    			a4 = element("a");
    			i1 = element("i");
    			t38 = text(" Op??tajte sa k tomuto produktu");
    			t39 = space();
    			div24 = element("div");
    			div22 = element("div");
    			t40 = text(/*count*/ ctx[4]);
    			t41 = space();
    			div21 = element("div");
    			div19 = element("div");
    			i2 = element("i");
    			t42 = space();
    			div20 = element("div");
    			i3 = element("i");
    			t43 = space();
    			div23 = element("div");
    			i4 = element("i");
    			t44 = text(" Prida?? do ko????ka");
    			t45 = space();
    			div25 = element("div");
    			i5 = element("i");
    			t46 = text(" Prida?? do wishlistu");
    			t47 = space();
    			div35 = element("div");
    			div30 = element("div");
    			div30.textContent = `${/*product*/ ctx[7][0].description_title}`;
    			t49 = space();
    			div33 = element("div");
    			div31 = element("div");
    			t50 = space();
    			div32 = element("div");
    			t51 = space();
    			div34 = element("div");
    			div34.textContent = `${/*product*/ ctx[7][0].description}`;
    			attr_dev(div0, "class", "title svelte-v9nuel");
    			add_location(div0, file$b, 55, 8, 1562);
    			attr_dev(a0, "href", "./#");
    			add_location(a0, file$b, 57, 12, 1673);
    			attr_dev(a1, "href", "./#/obchod");
    			add_location(a1, file$b, 57, 38, 1699);
    			attr_dev(a2, "href", a2_href_value = "./#/obchod/" + /*params*/ ctx[0].category);
    			add_location(a2, file$b, 57, 72, 1733);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$b, 57, 137, 1798);
    			attr_dev(div1, "class", "nav svelte-v9nuel");
    			add_location(div1, file$b, 56, 8, 1642);
    			attr_dev(div2, "class", "title-container svelte-v9nuel");
    			add_location(div2, file$b, 54, 4, 1523);
    			if (!src_url_equal(img_1.src, img_1_src_value = /*product*/ ctx[7][0].image_urls[/*img*/ ctx[5]])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", /*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version);
    			attr_dev(img_1, "class", "svelte-v9nuel");
    			add_location(img_1, file$b, 64, 20, 2102);
    			attr_dev(div3, "class", "img-index svelte-v9nuel");
    			add_location(div3, file$b, 68, 20, 2357);
    			attr_dev(div4, "class", "product-images svelte-v9nuel");
    			add_location(div4, file$b, 63, 16, 2027);
    			attr_dev(div5, "class", "arrows svelte-v9nuel");
    			add_location(div5, file$b, 70, 16, 2470);
    			attr_dev(div6, "class", "left-container svelte-v9nuel");
    			add_location(div6, file$b, 62, 12, 1981);
    			attr_dev(div7, "class", "product-title svelte-v9nuel");
    			add_location(div7, file$b, 78, 16, 3009);
    			attr_dev(div8, "class", "price svelte-v9nuel");
    			add_location(div8, file$b, 79, 16, 3105);
    			attr_dev(div9, "class", "short-description svelte-v9nuel");
    			add_location(div9, file$b, 87, 16, 3640);
    			add_location(b0, file$b, 90, 68, 3843);
    			attr_dev(div10, "class", "producer product-info svelte-v9nuel");
    			add_location(div10, file$b, 90, 24, 3799);
    			add_location(b1, file$b, 91, 75, 3954);
    			attr_dev(div11, "class", "availability product-info svelte-v9nuel");
    			add_location(div11, file$b, 91, 24, 3903);
    			add_location(b2, file$b, 92, 73, 4067);
    			attr_dev(div12, "class", "category product-info svelte-v9nuel");
    			add_location(div12, file$b, 92, 24, 4018);
    			add_location(b3, file$b, 93, 62, 4163);
    			attr_dev(div13, "class", "color-title product-info svelte-v9nuel");
    			add_location(div13, file$b, 93, 24, 4125);
    			attr_dev(form, "class", "svelte-v9nuel");
    			add_location(form, file$b, 95, 28, 4257);
    			attr_dev(div14, "class", "color svelte-v9nuel");
    			add_location(div14, file$b, 94, 24, 4208);
    			add_location(div15, file$b, 89, 20, 3768);
    			attr_dev(i0, "class", "fas fa-truck svelte-v9nuel");
    			add_location(i0, file$b, 108, 76, 5064);
    			attr_dev(a3, "href", "#/shipping");
    			attr_dev(a3, "class", "svelte-v9nuel");
    			add_location(a3, file$b, 108, 55, 5043);
    			attr_dev(div16, "class", "shipping link svelte-v9nuel");
    			add_location(div16, file$b, 108, 28, 5016);
    			attr_dev(i1, "class", "fas fa-envelope svelte-v9nuel");
    			add_location(i1, file$b, 109, 75, 5187);
    			attr_dev(a4, "href", "#/kontakt");
    			attr_dev(a4, "class", "svelte-v9nuel");
    			add_location(a4, file$b, 109, 55, 5167);
    			attr_dev(div17, "class", "question link svelte-v9nuel");
    			add_location(div17, file$b, 109, 28, 5140);
    			attr_dev(div18, "class", "info-links svelte-v9nuel");
    			add_location(div18, file$b, 107, 24, 4962);
    			attr_dev(i2, "class", "fas fa-chevron-up svelte-v9nuel");
    			add_location(i2, file$b, 115, 90, 5595);
    			add_location(div19, file$b, 115, 36, 5541);
    			attr_dev(i3, "class", "fas fa-chevron-down svelte-v9nuel");
    			add_location(i3, file$b, 116, 89, 5725);
    			add_location(div20, file$b, 116, 36, 5672);
    			attr_dev(div21, "class", "counter-arrows svelte-v9nuel");
    			add_location(div21, file$b, 114, 32, 5475);
    			attr_dev(div22, "class", "counter svelte-v9nuel");
    			add_location(div22, file$b, 112, 28, 5379);
    			attr_dev(i4, "class", "fas fa-cart-plus svelte-v9nuel");
    			add_location(i4, file$b, 120, 32, 5989);
    			attr_dev(div23, "class", "add-to-card svelte-v9nuel");
    			add_location(div23, file$b, 119, 28, 5872);
    			attr_dev(div24, "class", "add-to-card-counter svelte-v9nuel");
    			add_location(div24, file$b, 111, 24, 5316);
    			attr_dev(i5, "class", "fas fa-heart svelte-v9nuel");
    			add_location(i5, file$b, 124, 28, 6236);
    			attr_dev(div25, "class", "add-to-wishlist svelte-v9nuel");
    			add_location(div25, file$b, 123, 24, 6132);
    			add_location(div26, file$b, 106, 20, 4931);
    			attr_dev(div27, "class", "wrapper svelte-v9nuel");
    			add_location(div27, file$b, 88, 16, 3725);
    			attr_dev(div28, "class", "product-information svelte-v9nuel");
    			add_location(div28, file$b, 77, 12, 2958);
    			attr_dev(div29, "class", "product-container svelte-v9nuel");
    			add_location(div29, file$b, 61, 8, 1936);
    			attr_dev(div30, "class", "title-description svelte-v9nuel");
    			add_location(div30, file$b, 131, 12, 6464);
    			attr_dev(div31, "class", "line svelte-v9nuel");
    			add_location(div31, file$b, 135, 16, 6614);
    			attr_dev(div32, "class", "line svelte-v9nuel");
    			add_location(div32, file$b, 136, 16, 6656);
    			attr_dev(div33, "class", "lines svelte-v9nuel");
    			add_location(div33, file$b, 134, 12, 6577);
    			attr_dev(div34, "class", "full-description svelte-v9nuel");
    			add_location(div34, file$b, 138, 12, 6714);
    			attr_dev(div35, "class", "description-of-product svelte-v9nuel");
    			add_location(div35, file$b, 130, 8, 6414);
    			attr_dev(div36, "class", "container");
    			add_location(div36, file$b, 60, 4, 1903);
    			attr_dev(main, "class", "svelte-v9nuel");
    			add_location(main, file$b, 52, 0, 1356);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(gallery, main, null);
    			append_dev(main, t1);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t5);
    			append_dev(div1, a1);
    			append_dev(div1, t7);
    			append_dev(div1, a2);
    			append_dev(a2, t8);
    			append_dev(div1, t9);
    			append_dev(div1, span);
    			append_dev(main, t11);
    			append_dev(main, div36);
    			append_dev(div36, div29);
    			append_dev(div29, div6);
    			append_dev(div6, div4);
    			append_dev(div4, img_1);
    			append_dev(div4, t12);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div3, t16);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			if (if_block1) if_block1.m(div5, null);
    			append_dev(div29, t18);
    			append_dev(div29, div28);
    			append_dev(div28, div7);
    			append_dev(div28, t20);
    			append_dev(div28, div8);
    			if_block2.m(div8, null);
    			append_dev(div28, t21);
    			append_dev(div28, div9);
    			append_dev(div28, t23);
    			append_dev(div28, div27);
    			append_dev(div27, div15);
    			append_dev(div15, div10);
    			append_dev(div10, t24);
    			append_dev(div10, b0);
    			append_dev(div15, t26);
    			append_dev(div15, div11);
    			append_dev(div11, t27);
    			append_dev(div11, b1);
    			append_dev(div15, t29);
    			append_dev(div15, div12);
    			append_dev(div12, t30);
    			append_dev(div12, b2);
    			append_dev(div15, t32);
    			append_dev(div15, div13);
    			append_dev(div13, b3);
    			append_dev(div15, t34);
    			append_dev(div15, div14);
    			append_dev(div14, form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append_dev(div27, t35);
    			append_dev(div27, div26);
    			append_dev(div26, div18);
    			append_dev(div18, div16);
    			append_dev(div16, a3);
    			append_dev(a3, i0);
    			append_dev(a3, t36);
    			append_dev(div18, t37);
    			append_dev(div18, div17);
    			append_dev(div17, a4);
    			append_dev(a4, i1);
    			append_dev(a4, t38);
    			append_dev(div26, t39);
    			append_dev(div26, div24);
    			append_dev(div24, div22);
    			append_dev(div22, t40);
    			append_dev(div22, t41);
    			append_dev(div22, div21);
    			append_dev(div21, div19);
    			append_dev(div19, i2);
    			append_dev(div21, t42);
    			append_dev(div21, div20);
    			append_dev(div20, i3);
    			append_dev(div24, t43);
    			append_dev(div24, div23);
    			append_dev(div23, i4);
    			append_dev(div23, t44);
    			append_dev(div26, t45);
    			append_dev(div26, div25);
    			append_dev(div25, i5);
    			append_dev(div25, t46);
    			append_dev(div36, t47);
    			append_dev(div36, div35);
    			append_dev(div35, div30);
    			append_dev(div35, t49);
    			append_dev(div35, div33);
    			append_dev(div33, div31);
    			append_dev(div33, t50);
    			append_dev(div33, div32);
    			append_dev(div35, t51);
    			append_dev(div35, div34);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div4, "click", /*showGallery*/ ctx[8], false, false, false),
    					listen_dev(div19, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev(div20, "click", /*click_handler_3*/ ctx[14], false, false, false),
    					listen_dev(
    						div23,
    						"click",
    						function () {
    							if (is_function(addToCart(/*product*/ ctx[7][0], /*selected_color*/ ctx[3], /*count*/ ctx[4]))) addToCart(/*product*/ ctx[7][0], /*selected_color*/ ctx[3], /*count*/ ctx[4]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div25, "click", /*click_handler_4*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if ((!current || dirty & /*product*/ 128) && title_value !== (title_value = /*product*/ ctx[7][0].title + ' ' + /*product*/ ctx[7][0].version)) {
    				document.title = title_value;
    			}

    			const gallery_changes = {};
    			if (dirty & /*img*/ 32) gallery_changes.active_img = /*img*/ ctx[5];
    			if (dirty & /*show*/ 2) gallery_changes.show = /*show*/ ctx[1];
    			if (dirty & /*random_num*/ 4) gallery_changes.random_num = /*random_num*/ ctx[2];
    			gallery.$set(gallery_changes);

    			if (!current || dirty & /*params*/ 1 && a2_href_value !== (a2_href_value = "./#/obchod/" + /*params*/ ctx[0].category)) {
    				attr_dev(a2, "href", a2_href_value);
    			}

    			if (!current || dirty & /*img*/ 32 && !src_url_equal(img_1.src, img_1_src_value = /*product*/ ctx[7][0].image_urls[/*img*/ ctx[5]])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if ((!current || dirty & /*img*/ 32) && t14_value !== (t14_value = /*img*/ ctx[5] + 1 + "")) set_data_dev(t14, t14_value);
    			if (/*product*/ ctx[7][0].image_urls.length > 1) if_block1.p(ctx, dirty);
    			if_block2.p(ctx, dirty);

    			if (dirty & /*product, selected_color*/ 136) {
    				each_value = /*product*/ ctx[7][0].colors;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(form, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*count*/ 16) set_data_dev(t40, /*count*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(gallery);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Product', slots, []);
    	let { params = {} } = $$props;
    	let category = categories.filter(x => x.title.toLowerCase() == params.category.split('_').join(' '));

    	if (category.length == 0) {
    		location.replace("#/NotFound");
    	}

    	let products_filtered = products.filter(x => x.category == category[0].id);

    	if (products_filtered.length == 0) {
    		location.replace("#/NotFound");
    	}

    	let product = products_filtered.filter(x => x.title.toLowerCase() + ' ' + x.version.toLowerCase() == params.product.split('_').join(' '));

    	if (product.length == 0) {
    		location.replace("#/NotFound");
    	}

    	let show = false;
    	let random_num = Math.random();
    	let selected_color = product[0].colors[0];
    	let count = 1;
    	let img = 0;

    	function showGallery() {
    		if (window.innerWidth > 600) {
    			$$invalidate(1, show = true);
    			$$invalidate(2, random_num = Math.random());
    		}
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];
    	const click_handler = () => img > 0 ? $$invalidate(5, img -= 1) : img;

    	const click_handler_1 = () => img < product[0].image_urls.length - 1
    	? $$invalidate(5, img += 1)
    	: img;

    	function input_change_handler() {
    		selected_color = this.__value;
    		$$invalidate(3, selected_color);
    	}

    	const click_handler_2 = () => count < 10 ? $$invalidate(4, count += 1) : count;
    	const click_handler_3 = () => count > 1 ? $$invalidate(4, count -= 1) : count;
    	const click_handler_4 = () => addToWishlist(product[0]);

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Gallery,
    		products,
    		categories,
    		params,
    		addToCart,
    		addToWishlist,
    		category,
    		products_filtered,
    		product,
    		show,
    		random_num,
    		selected_color,
    		count,
    		img,
    		showGallery
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    		if ('category' in $$props) $$invalidate(6, category = $$props.category);
    		if ('products_filtered' in $$props) products_filtered = $$props.products_filtered;
    		if ('product' in $$props) $$invalidate(7, product = $$props.product);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(2, random_num = $$props.random_num);
    		if ('selected_color' in $$props) $$invalidate(3, selected_color = $$props.selected_color);
    		if ('count' in $$props) $$invalidate(4, count = $$props.count);
    		if ('img' in $$props) $$invalidate(5, img = $$props.img);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		show,
    		random_num,
    		selected_color,
    		count,
    		img,
    		category,
    		product,
    		showGallery,
    		click_handler,
    		click_handler_1,
    		input_change_handler,
    		$$binding_groups,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get params() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Contact.svelte generated by Svelte v3.46.4 */

    const file$a = "src\\routes\\Contact.svelte";

    function create_fragment$a(ctx) {
    	let t0;
    	let main;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let a;
    	let t4;
    	let span;
    	let t6;
    	let div15;
    	let div6;
    	let div3;
    	let i0;
    	let t7;
    	let div4;
    	let t9;
    	let div5;
    	let t11;
    	let div10;
    	let div7;
    	let i1;
    	let t12;
    	let div8;
    	let t14;
    	let div9;
    	let t16;
    	let div14;
    	let div11;
    	let i2;
    	let t17;
    	let div12;
    	let t19;
    	let div13;
    	let t21;
    	let div25;
    	let div16;
    	let t23;
    	let div17;
    	let t25;
    	let div24;
    	let form;
    	let label0;
    	let div18;
    	let t27;
    	let input0;
    	let t28;
    	let label1;
    	let div19;
    	let t30;
    	let input1;
    	let t31;
    	let label2;
    	let div20;
    	let t33;
    	let input2;
    	let t34;
    	let label3;
    	let div21;
    	let t36;
    	let input3;
    	let t37;
    	let label4;
    	let div22;
    	let t39;
    	let textarea;
    	let t40;
    	let input4;
    	let t41;
    	let div23;
    	let img;
    	let img_src_value;
    	let t42;
    	let div28;
    	let div27;
    	let div26;
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Kontaktujte n??s";
    			t2 = space();
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "Domov";
    			t4 = text(" / ");
    			span = element("span");
    			span.textContent = "Kontakt";
    			t6 = space();
    			div15 = element("div");
    			div6 = element("div");
    			div3 = element("div");
    			i0 = element("i");
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "Adresa";
    			t9 = space();
    			div5 = element("div");
    			div5.textContent = "1910 Blvd, The Bronx, NY, USA";
    			t11 = space();
    			div10 = element("div");
    			div7 = element("div");
    			i1 = element("i");
    			t12 = space();
    			div8 = element("div");
    			div8.textContent = "Telef??n";
    			t14 = space();
    			div9 = element("div");
    			div9.textContent = "+421 234 567 890";
    			t16 = space();
    			div14 = element("div");
    			div11 = element("div");
    			i2 = element("i");
    			t17 = space();
    			div12 = element("div");
    			div12.textContent = "Email";
    			t19 = space();
    			div13 = element("div");
    			div13.textContent = "info@elektrox.sk";
    			t21 = space();
    			div25 = element("div");
    			div16 = element("div");
    			div16.textContent = "Kontaktujte n??s";
    			t23 = space();
    			div17 = element("div");
    			div17.textContent = "Kontakujte n??s pomocou formul??ru";
    			t25 = space();
    			div24 = element("div");
    			form = element("form");
    			label0 = element("label");
    			div18 = element("div");
    			div18.textContent = "Meno a priezvisko";
    			t27 = space();
    			input0 = element("input");
    			t28 = space();
    			label1 = element("label");
    			div19 = element("div");
    			div19.textContent = "Email";
    			t30 = space();
    			input1 = element("input");
    			t31 = space();
    			label2 = element("label");
    			div20 = element("div");
    			div20.textContent = "Telef??nne ????slo";
    			t33 = space();
    			input2 = element("input");
    			t34 = space();
    			label3 = element("label");
    			div21 = element("div");
    			div21.textContent = "Predmet";
    			t36 = space();
    			input3 = element("input");
    			t37 = space();
    			label4 = element("label");
    			div22 = element("div");
    			div22.textContent = "Va??a spr??va";
    			t39 = space();
    			textarea = element("textarea");
    			t40 = space();
    			input4 = element("input");
    			t41 = space();
    			div23 = element("div");
    			img = element("img");
    			t42 = space();
    			div28 = element("div");
    			div27 = element("div");
    			div26 = element("div");
    			iframe = element("iframe");
    			document.title = "Kontakt";
    			attr_dev(div0, "class", "title svelte-1pglro3");
    			add_location(div0, file$a, 11, 8, 167);
    			attr_dev(a, "href", "./#");
    			add_location(a, file$a, 13, 12, 248);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$a, 13, 38, 274);
    			attr_dev(div1, "class", "nav svelte-1pglro3");
    			add_location(div1, file$a, 12, 8, 217);
    			attr_dev(div2, "class", "title-container svelte-1pglro3");
    			add_location(div2, file$a, 10, 4, 128);
    			attr_dev(i0, "class", "fas fa-map-marker-alt svelte-1pglro3");
    			add_location(i0, file$a, 18, 35, 455);
    			attr_dev(div3, "class", "item-icon svelte-1pglro3");
    			add_location(div3, file$a, 18, 12, 432);
    			attr_dev(div4, "class", "contact-item-title svelte-1pglro3");
    			add_location(div4, file$a, 19, 12, 512);
    			attr_dev(div5, "class", "contact-item-info svelte-1pglro3");
    			add_location(div5, file$a, 20, 12, 570);
    			attr_dev(div6, "class", "contact-info-item svelte-1pglro3");
    			add_location(div6, file$a, 17, 8, 387);
    			attr_dev(i1, "class", "fas fa-phone-alt svelte-1pglro3");
    			add_location(i1, file$a, 23, 35, 730);
    			attr_dev(div7, "class", "item-icon svelte-1pglro3");
    			add_location(div7, file$a, 23, 12, 707);
    			attr_dev(div8, "class", "contact-item-title svelte-1pglro3");
    			add_location(div8, file$a, 24, 12, 782);
    			attr_dev(div9, "class", "contact-item-info svelte-1pglro3");
    			add_location(div9, file$a, 25, 12, 841);
    			attr_dev(div10, "class", "contact-info-item svelte-1pglro3");
    			add_location(div10, file$a, 22, 8, 662);
    			attr_dev(i2, "class", "fas fa-envelope svelte-1pglro3");
    			add_location(i2, file$a, 28, 35, 988);
    			attr_dev(div11, "class", "item-icon svelte-1pglro3");
    			add_location(div11, file$a, 28, 12, 965);
    			attr_dev(div12, "class", "contact-item-title svelte-1pglro3");
    			add_location(div12, file$a, 29, 12, 1039);
    			attr_dev(div13, "class", "contact-item-info svelte-1pglro3");
    			add_location(div13, file$a, 30, 12, 1096);
    			attr_dev(div14, "class", "contact-info-item svelte-1pglro3");
    			add_location(div14, file$a, 27, 8, 920);
    			attr_dev(div15, "class", "contact-info container svelte-1pglro3");
    			add_location(div15, file$a, 16, 4, 341);
    			attr_dev(div16, "class", "form-subtitle svelte-1pglro3");
    			add_location(div16, file$a, 34, 8, 1221);
    			attr_dev(div17, "class", "form-title svelte-1pglro3");
    			add_location(div17, file$a, 37, 8, 1303);
    			attr_dev(div18, "class", "label-title svelte-1pglro3");
    			add_location(div18, file$a, 43, 20, 1523);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "i-text svelte-1pglro3");
    			add_location(input0, file$a, 44, 20, 1593);
    			attr_dev(label0, "class", "svelte-1pglro3");
    			add_location(label0, file$a, 42, 16, 1494);
    			attr_dev(div19, "class", "label-title svelte-1pglro3");
    			add_location(div19, file$a, 47, 20, 1700);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "i-text svelte-1pglro3");
    			add_location(input1, file$a, 48, 20, 1758);
    			attr_dev(label1, "class", "svelte-1pglro3");
    			add_location(label1, file$a, 46, 16, 1671);
    			attr_dev(div20, "class", "label-title svelte-1pglro3");
    			add_location(div20, file$a, 51, 20, 1866);
    			attr_dev(input2, "type", "tel");
    			attr_dev(input2, "class", "i-text svelte-1pglro3");
    			add_location(input2, file$a, 52, 20, 1934);
    			attr_dev(label2, "class", "svelte-1pglro3");
    			add_location(label2, file$a, 50, 16, 1837);
    			attr_dev(div21, "class", "label-title svelte-1pglro3");
    			add_location(div21, file$a, 55, 20, 2040);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "class", "i-text svelte-1pglro3");
    			add_location(input3, file$a, 56, 20, 2100);
    			attr_dev(label3, "class", "svelte-1pglro3");
    			add_location(label3, file$a, 54, 16, 2011);
    			attr_dev(div22, "class", "label-title svelte-1pglro3");
    			add_location(div22, file$a, 59, 20, 2224);
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "class", "svelte-1pglro3");
    			add_location(textarea, file$a, 60, 20, 2288);
    			attr_dev(label4, "class", "textarea svelte-1pglro3");
    			add_location(label4, file$a, 58, 16, 2178);
    			attr_dev(input4, "type", "submit");
    			input4.value = "Odosla?? spr??vu";
    			attr_dev(input4, "class", "svelte-1pglro3");
    			add_location(input4, file$a, 62, 16, 2373);
    			attr_dev(form, "action", "javascript:void(0);");
    			attr_dev(form, "class", "svelte-1pglro3");
    			add_location(form, file$a, 41, 12, 1441);
    			if (!src_url_equal(img.src, img_src_value = "img/contact.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1pglro3");
    			add_location(img, file$a, 65, 16, 2495);
    			attr_dev(div23, "class", "contact-img svelte-1pglro3");
    			add_location(div23, file$a, 64, 12, 2452);
    			attr_dev(div24, "class", "flex-container svelte-1pglro3");
    			add_location(div24, file$a, 40, 8, 1399);
    			attr_dev(div25, "class", "form container svelte-1pglro3");
    			add_location(div25, file$a, 33, 4, 1183);
    			attr_dev(iframe, "class", "gmap_iframe svelte-1pglro3");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "title", "Map");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "scrolling", "no");
    			attr_dev(iframe, "marginheight", "0");
    			attr_dev(iframe, "marginwidth", "0");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://maps.google.com/maps?width=1532&height=426&hl=en&q=University of Oxford&t=&z=14&ie=UTF8&iwloc=B&output=embed")) attr_dev(iframe, "src", iframe_src_value);
    			add_location(iframe, file$a, 71, 12, 2675);
    			attr_dev(div26, "class", "gmap_canvas svelte-1pglro3");
    			add_location(div26, file$a, 70, 30, 2636);
    			attr_dev(div27, "class", "mapouter svelte-1pglro3");
    			add_location(div27, file$a, 70, 8, 2614);
    			attr_dev(div28, "class", "map");
    			add_location(div28, file$a, 69, 4, 2587);
    			attr_dev(main, "class", "svelte-1pglro3");
    			add_location(main, file$a, 9, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(main, t6);
    			append_dev(main, div15);
    			append_dev(div15, div6);
    			append_dev(div6, div3);
    			append_dev(div3, i0);
    			append_dev(div6, t7);
    			append_dev(div6, div4);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div15, t11);
    			append_dev(div15, div10);
    			append_dev(div10, div7);
    			append_dev(div7, i1);
    			append_dev(div10, t12);
    			append_dev(div10, div8);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div15, t16);
    			append_dev(div15, div14);
    			append_dev(div14, div11);
    			append_dev(div11, i2);
    			append_dev(div14, t17);
    			append_dev(div14, div12);
    			append_dev(div14, t19);
    			append_dev(div14, div13);
    			append_dev(main, t21);
    			append_dev(main, div25);
    			append_dev(div25, div16);
    			append_dev(div25, t23);
    			append_dev(div25, div17);
    			append_dev(div25, t25);
    			append_dev(div25, div24);
    			append_dev(div24, form);
    			append_dev(form, label0);
    			append_dev(label0, div18);
    			append_dev(label0, t27);
    			append_dev(label0, input0);
    			append_dev(form, t28);
    			append_dev(form, label1);
    			append_dev(label1, div19);
    			append_dev(label1, t30);
    			append_dev(label1, input1);
    			append_dev(form, t31);
    			append_dev(form, label2);
    			append_dev(label2, div20);
    			append_dev(label2, t33);
    			append_dev(label2, input2);
    			append_dev(form, t34);
    			append_dev(form, label3);
    			append_dev(label3, div21);
    			append_dev(label3, t36);
    			append_dev(label3, input3);
    			append_dev(form, t37);
    			append_dev(form, label4);
    			append_dev(label4, div22);
    			append_dev(label4, t39);
    			append_dev(label4, textarea);
    			append_dev(form, t40);
    			append_dev(form, input4);
    			append_dev(div24, t41);
    			append_dev(div24, div23);
    			append_dev(div23, img);
    			append_dev(main, t42);
    			append_dev(main, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, iframe);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\routes\NotFound.svelte generated by Svelte v3.46.4 */

    const file$9 = "src\\routes\\NotFound.svelte";

    function create_fragment$9(ctx) {
    	let t0;
    	let main;
    	let div5;
    	let div4;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let t4;
    	let a;
    	let div3;

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "404";
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = "PAGE NOT FOUND";
    			t4 = space();
    			a = element("a");
    			div3 = element("div");
    			div3.textContent = "Vr??ti?? sa na domovsk?? str??nku";
    			document.title = "Page Not Found";
    			attr_dev(div0, "class", "code svelte-qhx6tw");
    			add_location(div0, file$9, 14, 16, 275);
    			attr_dev(div1, "class", "message svelte-qhx6tw");
    			add_location(div1, file$9, 15, 16, 321);
    			attr_dev(div2, "class", "flex-container svelte-qhx6tw");
    			add_location(div2, file$9, 13, 12, 229);
    			attr_dev(div3, "class", "button svelte-qhx6tw");
    			add_location(div3, file$9, 18, 16, 446);
    			attr_dev(a, "href", "./#");
    			attr_dev(a, "class", "button-a svelte-qhx6tw");
    			add_location(a, file$9, 17, 12, 397);
    			attr_dev(div4, "class", "container error-container svelte-qhx6tw");
    			add_location(div4, file$9, 12, 8, 176);
    			attr_dev(div5, "class", "error svelte-qhx6tw");
    			add_location(div5, file$9, 11, 4, 147);
    			add_location(main, file$9, 10, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div4, t4);
    			append_dev(div4, a);
    			append_dev(a, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	let { params = {} } = $$props;
    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({ params });

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(0, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get params() {
    		throw new Error("<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Cart.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\routes\\Cart.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (131:8) {:else}
    function create_else_block_3(ctx) {
    	let table;
    	let t0;
    	let t1;
    	let if_block0 = /*cart_list*/ ctx[1].length > 0 && create_if_block_9(ctx);
    	let each_value_1 = /*cart_list*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_1_else_1 = null;

    	if (!each_value_1.length) {
    		each_1_else_1 = create_else_block_5(ctx);
    	}

    	let if_block1 = /*cart_list*/ ctx[1].length > 0 && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (if_block0) if_block0.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else_1) {
    				each_1_else_1.c();
    			}

    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(table, "class", "svelte-148roh1");
    			add_location(table, file$8, 131, 12, 5824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if (if_block0) if_block0.m(table, null);
    			append_dev(table, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			if (each_1_else_1) {
    				each_1_else_1.m(table, null);
    			}

    			append_dev(table, t1);
    			if (if_block1) if_block1.m(table, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*cart_list*/ ctx[1].length > 0) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(table, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*removeItemFromCart, cart_list, width, changeNumOfItems, categories*/ 35) {
    				each_value_1 = /*cart_list*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;

    				if (each_value_1.length) {
    					if (each_1_else_1) {
    						each_1_else_1.d(1);
    						each_1_else_1 = null;
    					}
    				} else if (!each_1_else_1) {
    					each_1_else_1 = create_else_block_5(ctx);
    					each_1_else_1.c();
    					each_1_else_1.m(table, t1);
    				}
    			}

    			if (/*cart_list*/ ctx[1].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(table, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (each_1_else_1) each_1_else_1.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(131:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if width > 630}
    function create_if_block_1$4(ctx) {
    	let table;
    	let t0;
    	let t1;
    	let if_block0 = /*cart_list*/ ctx[1].length > 0 && create_if_block_5(ctx);
    	let each_value = /*cart_list*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_2(ctx);
    	}

    	let if_block1 = /*cart_list*/ ctx[1].length > 0 && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (if_block0) if_block0.c();
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(table, "class", "svelte-148roh1");
    			add_location(table, file$8, 54, 12, 1844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if (if_block0) if_block0.m(table, null);
    			append_dev(table, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(table, null);
    			}

    			append_dev(table, t1);
    			if (if_block1) if_block1.m(table, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*cart_list*/ ctx[1].length > 0) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(table, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*removeItemFromCart, cart_list, changeNumOfItems, categories*/ 34) {
    				each_value = /*cart_list*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block_2(ctx);
    					each_1_else.c();
    					each_1_else.m(table, t1);
    				}
    			}

    			if (/*cart_list*/ ctx[1].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(table, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(54:8) {#if width > 630}",
    		ctx
    	});

    	return block;
    }

    // (133:16) {#if cart_list.length > 0}
    function create_if_block_9(ctx) {
    	let tr;
    	let th0;
    	let t1;
    	let th1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Produkt";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Cena";
    			attr_dev(th0, "class", "svelte-148roh1");
    			add_location(th0, file$8, 134, 24, 5927);
    			attr_dev(th1, "class", "svelte-148roh1");
    			add_location(th1, file$8, 135, 24, 5969);
    			attr_dev(tr, "class", "svelte-148roh1");
    			add_location(tr, file$8, 133, 20, 5897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(133:16) {#if cart_list.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (168:16) {:else}
    function create_else_block_5(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("Tvoj ko????k je pr??zdny\r\n                    ");
    			a = element("a");
    			a.textContent = "Prezera?? obchod";
    			attr_dev(a, "href", "#/obchod");
    			attr_dev(a, "class", "button-a svelte-148roh1");
    			add_location(a, file$8, 169, 20, 8064);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(168:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (157:32) {:else}
    function create_else_block_4(ctx) {
    	let t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(157:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (152:32) {#if cart[0].discount_bollean}
    function create_if_block_7(ctx) {
    	let t0_value = /*cart*/ ctx[14][0].discount_price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let if_block = /*width*/ ctx[0] > 400 && create_if_block_8(ctx);

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???\r\n                                    ");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].discount_price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);

    			if (/*width*/ ctx[0] > 400) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(152:32) {#if cart[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (154:36) {#if width > 400}
    function create_if_block_8(ctx) {
    	let b;
    	let t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			attr_dev(b, "class", "old-price svelte-148roh1");
    			add_location(b, file$8, 154, 40, 7270);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			append_dev(b, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(154:36) {#if width > 400}",
    		ctx
    	});

    	return block;
    }

    // (139:16) {#each cart_list as cart, i}
    function create_each_block_1$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let div0;
    	let t2_value = /*cart*/ ctx[14][1].title + "";
    	let t2;
    	let t3;
    	let td1;
    	let span2;
    	let div3;
    	let div1;
    	let i0;
    	let t4;
    	let div2;
    	let i1;
    	let t5;
    	let t6_value = /*cart*/ ctx[14][2] + "";
    	let t6;
    	let t7;
    	let t8;
    	let span1;
    	let span0;
    	let i2;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[9](/*i*/ ctx[16], /*cart*/ ctx[14]);
    	}

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[10](/*i*/ ctx[16], /*cart*/ ctx[14]);
    	}

    	function select_block_type_3(ctx, dirty) {
    		if (/*cart*/ ctx[14][0].discount_bollean) return create_if_block_7;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[11](/*i*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			span2 = element("span");
    			div3 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t4 = space();
    			div2 = element("div");
    			i1 = element("i");
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = text("x\r\n                                ");
    			if_block.c();
    			t8 = space();
    			span1 = element("span");
    			span0 = element("span");
    			i2 = element("i");
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*cart*/ ctx[14][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version).toLowerCase().split(' ').join('_'));
    			add_location(a, file$8, 141, 28, 6182);
    			attr_dev(div0, "class", "color svelte-148roh1");
    			add_location(div0, file$8, 142, 28, 6423);
    			attr_dev(td0, "class", "svelte-148roh1");
    			add_location(td0, file$8, 140, 24, 6148);
    			attr_dev(i0, "class", "fas fa-chevron-up svelte-148roh1");
    			add_location(i0, file$8, 147, 91, 6755);
    			add_location(div1, file$8, 147, 36, 6700);
    			attr_dev(i1, "class", "fas fa-chevron-down svelte-148roh1");
    			add_location(i1, file$8, 148, 91, 6887);
    			add_location(div2, file$8, 148, 36, 6832);
    			attr_dev(div3, "class", "counter-arrows svelte-148roh1");
    			add_location(div3, file$8, 146, 32, 6634);
    			attr_dev(i2, "class", "fas fa-trash svelte-148roh1");
    			add_location(i2, file$8, 161, 40, 7724);
    			attr_dev(span0, "class", "remove-from-cart icon svelte-148roh1");
    			add_location(span0, file$8, 160, 36, 7646);
    			attr_dev(span1, "class", "icons svelte-148roh1");
    			add_location(span1, file$8, 159, 32, 7588);
    			attr_dev(span2, "class", "price-num counter svelte-148roh1");
    			add_location(span2, file$8, 145, 28, 6568);
    			attr_dev(td1, "class", "price svelte-148roh1");
    			add_location(td1, file$8, 144, 24, 6520);
    			attr_dev(tr, "class", "cart-item svelte-148roh1");
    			add_location(tr, file$8, 139, 20, 6100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(td0, t1);
    			append_dev(td0, div0);
    			append_dev(div0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, span2);
    			append_dev(span2, div3);
    			append_dev(div3, div1);
    			append_dev(div1, i0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, i1);
    			append_dev(span2, t5);
    			append_dev(span2, t6);
    			append_dev(span2, t7);
    			if_block.m(span2, null);
    			append_dev(span2, t8);
    			append_dev(span2, span1);
    			append_dev(span1, span0);
    			append_dev(span0, i2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", click_handler_3, false, false, false),
    					listen_dev(div2, "click", click_handler_4, false, false, false),
    					listen_dev(i2, "click", click_handler_5, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*cart_list*/ 2 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*cart*/ ctx[14][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*cart_list*/ 2 && t2_value !== (t2_value = /*cart*/ ctx[14][1].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*cart_list*/ 2 && t6_value !== (t6_value = /*cart*/ ctx[14][2] + "")) set_data_dev(t6, t6_value);

    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span2, t8);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(139:16) {#each cart_list as cart, i}",
    		ctx
    	});

    	return block;
    }

    // (174:16) {#if cart_list.length > 0}
    function create_if_block_6(ctx) {
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "";
    	let t2;
    	let t3;
    	let t4;
    	let tr1;
    	let td2;
    	let t6;
    	let td3;
    	let t9;
    	let tr2;
    	let td4;
    	let t11;
    	let td5;
    	let t12_value = (/*totalSum*/ ctx[2] + /*shipping*/ ctx[4]).toFixed(2).toString().split('.').join(',') + "";
    	let t12;
    	let t13;

    	const block = {
    		c: function create() {
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Medis????et";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = text(" ???");
    			t4 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			td2.textContent = "Doprava";
    			t6 = space();
    			td3 = element("td");
    			td3.textContent = `${/*shipping*/ ctx[4].toFixed(2).toString().split('.').join(',')} ???`;
    			t9 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			td4.textContent = "Spolu";
    			t11 = space();
    			td5 = element("td");
    			t12 = text(t12_value);
    			t13 = text(" ???");
    			attr_dev(td0, "class", "svelte-148roh1");
    			add_location(td0, file$8, 175, 24, 8305);
    			attr_dev(td1, "class", "svelte-148roh1");
    			add_location(td1, file$8, 176, 24, 8349);
    			attr_dev(tr0, "class", "subtotal svelte-148roh1");
    			add_location(tr0, file$8, 174, 20, 8258);
    			attr_dev(td2, "class", "svelte-148roh1");
    			add_location(td2, file$8, 181, 24, 8548);
    			attr_dev(td3, "class", "svelte-148roh1");
    			add_location(td3, file$8, 182, 24, 8590);
    			attr_dev(tr1, "class", "svelte-148roh1");
    			add_location(tr1, file$8, 180, 20, 8518);
    			attr_dev(td4, "class", "svelte-148roh1");
    			add_location(td4, file$8, 185, 24, 8747);
    			attr_dev(td5, "class", "svelte-148roh1");
    			add_location(td5, file$8, 186, 24, 8787);
    			attr_dev(tr2, "class", "total svelte-148roh1");
    			add_location(tr2, file$8, 184, 20, 8703);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr0, anchor);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(td1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, tr1, anchor);
    			append_dev(tr1, td2);
    			append_dev(tr1, t6);
    			append_dev(tr1, td3);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tr2, anchor);
    			append_dev(tr2, td4);
    			append_dev(tr2, t11);
    			append_dev(tr2, td5);
    			append_dev(td5, t12);
    			append_dev(td5, t13);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*totalSum*/ 4 && t2_value !== (t2_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*totalSum*/ 4 && t12_value !== (t12_value = (/*totalSum*/ ctx[2] + /*shipping*/ ctx[4]).toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t12, t12_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(tr1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tr2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(174:16) {#if cart_list.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (56:16) {#if cart_list.length > 0}
    function create_if_block_5(ctx) {
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t4;
    	let span;
    	let t6;
    	let th3;
    	let t8;
    	let th4;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Produkt";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Farba";
    			t3 = space();
    			th2 = element("th");
    			t4 = text("Cena ");
    			span = element("span");
    			span.textContent = "za ks";
    			t6 = space();
    			th3 = element("th");
    			th3.textContent = "Mno??stvo";
    			t8 = space();
    			th4 = element("th");
    			th4.textContent = "Cena";
    			attr_dev(th0, "class", "svelte-148roh1");
    			add_location(th0, file$8, 57, 24, 1947);
    			attr_dev(th1, "class", "svelte-148roh1");
    			add_location(th1, file$8, 58, 24, 1989);
    			attr_dev(span, "class", "per-piece svelte-148roh1");
    			add_location(span, file$8, 59, 33, 2038);
    			attr_dev(th2, "class", "svelte-148roh1");
    			add_location(th2, file$8, 59, 24, 2029);
    			attr_dev(th3, "class", "svelte-148roh1");
    			add_location(th3, file$8, 60, 24, 2105);
    			attr_dev(th4, "class", "svelte-148roh1");
    			add_location(th4, file$8, 61, 24, 2148);
    			attr_dev(tr, "class", "svelte-148roh1");
    			add_location(tr, file$8, 56, 20, 1917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(th2, span);
    			append_dev(tr, t6);
    			append_dev(tr, th3);
    			append_dev(tr, t8);
    			append_dev(tr, th4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(56:16) {#if cart_list.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (101:16) {:else}
    function create_else_block_2(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("Tvoj ko????k je pr??zdny\r\n                    ");
    			a = element("a");
    			a.textContent = "Prezera?? obchod";
    			attr_dev(a, "href", "#/obchod");
    			attr_dev(a, "class", "button-a svelte-148roh1");
    			add_location(a, file$8, 102, 20, 4627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(101:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:32) {:else}
    function create_else_block_1$2(ctx) {
    	let t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(74:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:32) {#if cart[0].discount_bollean}
    function create_if_block_4(ctx) {
    	let b;
    	let t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*cart*/ ctx[14][0].discount_price.toString().split('.').join(',') + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(" ???");
    			attr_dev(b, "class", "old-price svelte-148roh1");
    			add_location(b, file$8, 71, 36, 2797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			append_dev(b, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*cart_list*/ 2 && t3_value !== (t3_value = /*cart*/ ctx[14][0].discount_price.toString().split('.').join(',') + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(71:32) {#if cart[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (90:32) {:else}
    function create_else_block$4(ctx) {
    	let t0_value = (/*cart*/ ctx[14][0].price * /*cart*/ ctx[14][2]).toFixed(2).toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = (/*cart*/ ctx[14][0].price * /*cart*/ ctx[14][2]).toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(90:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (88:32) {#if cart[0].discount_bollean}
    function create_if_block_3$1(ctx) {
    	let t0_value = (/*cart*/ ctx[14][0].discount_price * /*cart*/ ctx[14][2]).toFixed(2).toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = (/*cart*/ ctx[14][0].discount_price * /*cart*/ ctx[14][2]).toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(88:32) {#if cart[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (65:16) {#each cart_list as cart, i}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*cart*/ ctx[14][1].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let span0;
    	let t4;
    	let td3;
    	let t5_value = /*cart*/ ctx[14][2] + "";
    	let t5;
    	let t6;
    	let div2;
    	let div0;
    	let i0;
    	let t7;
    	let div1;
    	let i1;
    	let t8;
    	let td4;
    	let span1;
    	let t9;
    	let span3;
    	let span2;
    	let i2;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*cart*/ ctx[14][0].discount_bollean) return create_if_block_4;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[16], /*cart*/ ctx[14]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[7](/*i*/ ctx[16], /*cart*/ ctx[14]);
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (/*cart*/ ctx[14][0].discount_bollean) return create_if_block_3$1;
    		return create_else_block$4;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[8](/*i*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			span0 = element("span");
    			if_block0.c();
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t7 = space();
    			div1 = element("div");
    			i1 = element("i");
    			t8 = space();
    			td4 = element("td");
    			span1 = element("span");
    			if_block1.c();
    			t9 = space();
    			span3 = element("span");
    			span2 = element("span");
    			i2 = element("i");
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*cart*/ ctx[14][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version).toLowerCase().split(' ').join('_'));
    			add_location(a, file$8, 66, 28, 2331);
    			attr_dev(td0, "class", "svelte-148roh1");
    			add_location(td0, file$8, 66, 24, 2327);
    			attr_dev(td1, "class", "svelte-148roh1");
    			add_location(td1, file$8, 67, 24, 2573);
    			attr_dev(span0, "class", "price-num");
    			add_location(span0, file$8, 69, 28, 2671);
    			attr_dev(td2, "class", "price svelte-148roh1");
    			add_location(td2, file$8, 68, 24, 2623);
    			attr_dev(i0, "class", "fas fa-chevron-up svelte-148roh1");
    			add_location(i0, file$8, 81, 87, 3434);
    			add_location(div0, file$8, 81, 32, 3379);
    			attr_dev(i1, "class", "fas fa-chevron-down svelte-148roh1");
    			add_location(i1, file$8, 82, 87, 3562);
    			add_location(div1, file$8, 82, 32, 3507);
    			attr_dev(div2, "class", "counter-arrows svelte-148roh1");
    			add_location(div2, file$8, 80, 28, 3317);
    			attr_dev(td3, "class", "counter svelte-148roh1");
    			add_location(td3, file$8, 78, 24, 3228);
    			attr_dev(span1, "class", "price-num");
    			add_location(span1, file$8, 86, 28, 3744);
    			attr_dev(i2, "class", "fas fa-trash svelte-148roh1");
    			add_location(i2, file$8, 95, 36, 4332);
    			attr_dev(span2, "class", "remove-from-cart icon svelte-148roh1");
    			add_location(span2, file$8, 94, 32, 4258);
    			attr_dev(span3, "class", "icons svelte-148roh1");
    			add_location(span3, file$8, 93, 28, 4204);
    			attr_dev(td4, "class", "price svelte-148roh1");
    			add_location(td4, file$8, 85, 24, 3696);
    			attr_dev(tr, "class", "cart-item svelte-148roh1");
    			add_location(tr, file$8, 65, 20, 2279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, span0);
    			if_block0.m(span0, null);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(td3, t6);
    			append_dev(td3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, i0);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, i1);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, span1);
    			if_block1.m(span1, null);
    			append_dev(td4, t9);
    			append_dev(td4, span3);
    			append_dev(span3, span2);
    			append_dev(span2, i2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", click_handler, false, false, false),
    					listen_dev(div1, "click", click_handler_1, false, false, false),
    					listen_dev(i2, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*cart_list*/ 2 && t0_value !== (t0_value = /*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*cart_list*/ 2 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*cart*/ ctx[14][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*cart*/ ctx[14][0].title + ' ' + /*cart*/ ctx[14][0].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*cart_list*/ 2 && t2_value !== (t2_value = /*cart*/ ctx[14][1].title + "")) set_data_dev(t2, t2_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(span0, null);
    				}
    			}

    			if (dirty & /*cart_list*/ 2 && t5_value !== (t5_value = /*cart*/ ctx[14][2] + "")) set_data_dev(t5, t5_value);

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(span1, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block0.d();
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(65:16) {#each cart_list as cart, i}",
    		ctx
    	});

    	return block;
    }

    // (107:16) {#if cart_list.length > 0}
    function create_if_block_2$2(ctx) {
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "";
    	let t8;
    	let t9;
    	let t10;
    	let tr1;
    	let td5;
    	let t12;
    	let td6;
    	let t14;
    	let td7;
    	let t16;
    	let td8;
    	let t18;
    	let td9;
    	let t21;
    	let tr2;
    	let td10;
    	let t23;
    	let td11;
    	let t25;
    	let td12;
    	let t27;
    	let td13;
    	let t28;
    	let t29;
    	let td14;
    	let t30_value = (/*totalSum*/ ctx[2] + /*shipping*/ ctx[4]).toFixed(2).toString().split('.').join(',') + "";
    	let t30;
    	let t31;

    	const block = {
    		c: function create() {
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "Medis????et";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "-";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "-";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(/*num_of_items*/ ctx[3]);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = text(" ???");
    			t10 = space();
    			tr1 = element("tr");
    			td5 = element("td");
    			td5.textContent = "Doprava";
    			t12 = space();
    			td6 = element("td");
    			td6.textContent = "-";
    			t14 = space();
    			td7 = element("td");
    			td7.textContent = "-";
    			t16 = space();
    			td8 = element("td");
    			td8.textContent = "-";
    			t18 = space();
    			td9 = element("td");
    			td9.textContent = `${/*shipping*/ ctx[4].toFixed(2).toString().split('.').join(',')} ???`;
    			t21 = space();
    			tr2 = element("tr");
    			td10 = element("td");
    			td10.textContent = "Spolu";
    			t23 = space();
    			td11 = element("td");
    			td11.textContent = "-";
    			t25 = space();
    			td12 = element("td");
    			td12.textContent = "-";
    			t27 = space();
    			td13 = element("td");
    			t28 = text(/*num_of_items*/ ctx[3]);
    			t29 = space();
    			td14 = element("td");
    			t30 = text(t30_value);
    			t31 = text(" ???");
    			attr_dev(td0, "class", "svelte-148roh1");
    			add_location(td0, file$8, 108, 24, 4868);
    			attr_dev(td1, "class", "svelte-148roh1");
    			add_location(td1, file$8, 109, 24, 4912);
    			attr_dev(td2, "class", "svelte-148roh1");
    			add_location(td2, file$8, 110, 24, 4948);
    			attr_dev(td3, "class", "svelte-148roh1");
    			add_location(td3, file$8, 111, 24, 4984);
    			attr_dev(td4, "class", "svelte-148roh1");
    			add_location(td4, file$8, 112, 24, 5033);
    			attr_dev(tr0, "class", "subtotal svelte-148roh1");
    			add_location(tr0, file$8, 107, 20, 4821);
    			attr_dev(td5, "class", "svelte-148roh1");
    			add_location(td5, file$8, 115, 24, 5176);
    			attr_dev(td6, "class", "svelte-148roh1");
    			add_location(td6, file$8, 116, 24, 5218);
    			attr_dev(td7, "class", "svelte-148roh1");
    			add_location(td7, file$8, 117, 24, 5254);
    			attr_dev(td8, "class", "svelte-148roh1");
    			add_location(td8, file$8, 118, 24, 5290);
    			attr_dev(td9, "class", "svelte-148roh1");
    			add_location(td9, file$8, 119, 24, 5326);
    			attr_dev(tr1, "class", "svelte-148roh1");
    			add_location(tr1, file$8, 114, 20, 5146);
    			attr_dev(td10, "class", "svelte-148roh1");
    			add_location(td10, file$8, 122, 24, 5483);
    			attr_dev(td11, "class", "svelte-148roh1");
    			add_location(td11, file$8, 123, 24, 5523);
    			attr_dev(td12, "class", "svelte-148roh1");
    			add_location(td12, file$8, 124, 24, 5559);
    			attr_dev(td13, "class", "svelte-148roh1");
    			add_location(td13, file$8, 125, 24, 5595);
    			attr_dev(td14, "class", "svelte-148roh1");
    			add_location(td14, file$8, 126, 24, 5644);
    			attr_dev(tr2, "class", "total svelte-148roh1");
    			add_location(tr2, file$8, 121, 20, 5439);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr0, anchor);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(td3, t6);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			append_dev(td4, t8);
    			append_dev(td4, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, tr1, anchor);
    			append_dev(tr1, td5);
    			append_dev(tr1, t12);
    			append_dev(tr1, td6);
    			append_dev(tr1, t14);
    			append_dev(tr1, td7);
    			append_dev(tr1, t16);
    			append_dev(tr1, td8);
    			append_dev(tr1, t18);
    			append_dev(tr1, td9);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, tr2, anchor);
    			append_dev(tr2, td10);
    			append_dev(tr2, t23);
    			append_dev(tr2, td11);
    			append_dev(tr2, t25);
    			append_dev(tr2, td12);
    			append_dev(tr2, t27);
    			append_dev(tr2, td13);
    			append_dev(td13, t28);
    			append_dev(tr2, t29);
    			append_dev(tr2, td14);
    			append_dev(td14, t30);
    			append_dev(td14, t31);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*num_of_items*/ 8) set_data_dev(t6, /*num_of_items*/ ctx[3]);
    			if (dirty & /*totalSum*/ 4 && t8_value !== (t8_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*num_of_items*/ 8) set_data_dev(t28, /*num_of_items*/ ctx[3]);
    			if (dirty & /*totalSum*/ 4 && t30_value !== (t30_value = (/*totalSum*/ ctx[2] + /*shipping*/ ctx[4]).toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t30, t30_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr0);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(tr1);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(tr2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(107:16) {#if cart_list.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (192:8) {#if cart_list.length > 0}
    function create_if_block$6(ctx) {
    	let div;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = "Pre dokon??enie objedn??vky sa prihl??ste";
    			attr_dev(a, "href", "#/login");
    			attr_dev(a, "class", "button-a b-login svelte-148roh1");
    			add_location(a, file$8, 193, 16, 9049);
    			attr_dev(div, "class", "button-container svelte-148roh1");
    			add_location(div, file$8, 192, 12, 9001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(192:8) {#if cart_list.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let a;
    	let t3;
    	let span;
    	let t5;
    	let div7;
    	let div3;
    	let t6;
    	let t7_value = /*cart_list*/ ctx[1].length + "";
    	let t7;
    	let t8;
    	let t9;
    	let div6;
    	let div4;
    	let t10;
    	let div5;
    	let t11;
    	let t12;
    	let t13;

    	function select_block_type(ctx, dirty) {
    		if (/*width*/ ctx[0] > 630) return create_if_block_1$4;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*cart_list*/ ctx[1].length > 0 && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Ko????k";
    			t1 = space();
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "Domov";
    			t3 = text(" / ");
    			span = element("span");
    			span.textContent = "Ko????k";
    			t5 = space();
    			div7 = element("div");
    			div3 = element("div");
    			t6 = text("Tvoj ko????k (");
    			t7 = text(t7_value);
    			t8 = text(")");
    			t9 = space();
    			div6 = element("div");
    			div4 = element("div");
    			t10 = space();
    			div5 = element("div");
    			t11 = space();
    			if_block0.c();
    			t12 = space();
    			if (if_block1) if_block1.c();
    			t13 = space();
    			attr_dev(div0, "class", "title svelte-148roh1");
    			add_location(div0, file$8, 42, 8, 1416);
    			attr_dev(a, "href", "./#");
    			add_location(a, file$8, 44, 12, 1487);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$8, 44, 38, 1513);
    			attr_dev(div1, "class", "nav svelte-148roh1");
    			add_location(div1, file$8, 43, 8, 1456);
    			attr_dev(div2, "class", "title-container svelte-148roh1");
    			add_location(div2, file$8, 41, 4, 1377);
    			attr_dev(div3, "class", "cart-title svelte-148roh1");
    			add_location(div3, file$8, 48, 8, 1616);
    			attr_dev(div4, "class", "blue-line svelte-148roh1");
    			add_location(div4, file$8, 50, 12, 1720);
    			attr_dev(div5, "class", "line svelte-148roh1");
    			add_location(div5, file$8, 51, 12, 1763);
    			attr_dev(div6, "class", "lines svelte-148roh1");
    			add_location(div6, file$8, 49, 8, 1687);
    			attr_dev(div7, "class", "container cart");
    			add_location(div7, file$8, 47, 4, 1578);
    			attr_dev(main, "class", "svelte-148roh1");
    			add_location(main, file$8, 40, 0, 1365);
    			document.title = "Ko????k";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(div1, t3);
    			append_dev(div1, span);
    			append_dev(main, t5);
    			append_dev(main, div7);
    			append_dev(div7, div3);
    			append_dev(div3, t6);
    			append_dev(div3, t7);
    			append_dev(div3, t8);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			append_dev(div7, t11);
    			if_block0.m(div7, null);
    			append_dev(div7, t12);
    			if (if_block1) if_block1.m(div7, null);
    			insert_dev(target, t13, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cart_list*/ 2 && t7_value !== (t7_value = /*cart_list*/ ctx[1].length + "")) set_data_dev(t7, t7_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div7, t12);
    				}
    			}

    			if (/*cart_list*/ ctx[1].length > 0) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(div7, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t13);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let cart_list;
    	let totalSum;
    	let num_of_items;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cart', slots, []);
    	let shipping = 3.50;

    	function calculateNumOfItems() {
    		$$invalidate(3, num_of_items = 0);

    		for (let i = 0; i < cart_list.length; i++) {
    			$$invalidate(3, num_of_items += cart_list[i][2]);
    		}
    	}

    	let width = window.innerWidth;

    	function IsCartChanged() {
    		$$invalidate(1, cart_list = JSON.parse(localStorage.getItem("cart"))
    		? JSON.parse(localStorage.getItem("cart"))
    		: []);

    		$$invalidate(2, totalSum = JSON.parse(localStorage.getItem("totalSum"))
    		? JSON.parse(localStorage.getItem("totalSum"))
    		: 0);

    		calculateNumOfItems();
    		$$invalidate(0, width = window.innerWidth);

    		setTimeout(
    			() => {
    				IsCartChanged();
    			},
    			100
    		);
    	}

    	IsCartChanged();

    	function changeNumOfItems(index, count) {
    		if (count > 0 && count <= 10) {
    			$$invalidate(1, cart_list[index][2] = count, cart_list);
    			localStorage.setItem("cart", JSON.stringify(cart_list));
    			calculateNumOfItems();
    			localStorage.setItem("totalSum", calculateTotalSum(cart_list));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, cart) => changeNumOfItems(i, cart[2] + 1);
    	const click_handler_1 = (i, cart) => changeNumOfItems(i, cart[2] - 1);
    	const click_handler_2 = i => removeItemFromCart(i);
    	const click_handler_3 = (i, cart) => changeNumOfItems(i, cart[2] + 1);
    	const click_handler_4 = (i, cart) => changeNumOfItems(i, cart[2] - 1);
    	const click_handler_5 = i => removeItemFromCart(i);

    	$$self.$capture_state = () => ({
    		removeItemFromCart,
    		calculateTotalSum,
    		categories,
    		shipping,
    		calculateNumOfItems,
    		width,
    		IsCartChanged,
    		changeNumOfItems,
    		cart_list,
    		totalSum,
    		num_of_items
    	});

    	$$self.$inject_state = $$props => {
    		if ('shipping' in $$props) $$invalidate(4, shipping = $$props.shipping);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('cart_list' in $$props) $$invalidate(1, cart_list = $$props.cart_list);
    		if ('totalSum' in $$props) $$invalidate(2, totalSum = $$props.totalSum);
    		if ('num_of_items' in $$props) $$invalidate(3, num_of_items = $$props.num_of_items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, cart_list = JSON.parse(localStorage.getItem("cart"))
    	? JSON.parse(localStorage.getItem("cart"))
    	: []);

    	$$invalidate(2, totalSum = JSON.parse(localStorage.getItem("totalSum"))
    	? JSON.parse(localStorage.getItem("totalSum"))
    	: 0);

    	$$invalidate(3, num_of_items = 0);

    	return [
    		width,
    		cart_list,
    		totalSum,
    		num_of_items,
    		shipping,
    		changeNumOfItems,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Cart$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\routes\Wishlist.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\routes\\Wishlist.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (35:12) {#if wishlist.length > 0}
    function create_if_block_1$3(ctx) {
    	let tr;
    	let th0;
    	let t1;
    	let th1;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Produkt";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Cena";
    			attr_dev(th0, "class", "svelte-1g3qcvf");
    			add_location(th0, file$7, 36, 20, 1088);
    			attr_dev(th1, "class", "svelte-1g3qcvf");
    			add_location(th1, file$7, 37, 20, 1126);
    			attr_dev(tr, "class", "svelte-1g3qcvf");
    			add_location(tr, file$7, 35, 16, 1062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(35:12) {#if wishlist.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (63:12) {:else}
    function create_else_block_1$1(ctx) {
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			t0 = text("Tvoj zoznam prijan?? je pr??zdny\r\n                ");
    			a = element("a");
    			a.textContent = "Prezera?? obchod\r\n                ";
    			attr_dev(a, "href", "#/obchod");
    			attr_dev(a, "class", "button-a svelte-1g3qcvf");
    			add_location(a, file$7, 64, 16, 2659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(63:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:28) {:else}
    function create_else_block$3(ctx) {
    	let t0_value = /*wish*/ ctx[4].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" ???");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*wishlist*/ 1 && t0_value !== (t0_value = /*wish*/ ctx[4].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(49:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:28) {#if wish.discount_bollean}
    function create_if_block$5(ctx) {
    	let b;
    	let t0_value = /*wish*/ ctx[4].price.toString().split('.').join(',') + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*wish*/ ctx[4].discount_price.toString().split('.').join(',') + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = text(" ???");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text(" ???");
    			attr_dev(b, "class", "old-price svelte-1g3qcvf");
    			add_location(b, file$7, 46, 32, 1670);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			append_dev(b, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*wishlist*/ 1 && t0_value !== (t0_value = /*wish*/ ctx[4].price.toString().split('.').join(',') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*wishlist*/ 1 && t3_value !== (t3_value = /*wish*/ ctx[4].discount_price.toString().split('.').join(',') + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(46:28) {#if wish.discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (41:12) {#each wishlist as wish, i}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*wish*/ ctx[4].title + ' ' + /*wish*/ ctx[4].version + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let span0;
    	let t2;
    	let span3;
    	let span1;
    	let i0;
    	let t3;
    	let span2;
    	let i1;
    	let t4;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*wish*/ ctx[4].discount_bollean) return create_if_block$5;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[1](/*wish*/ ctx[4]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[2](/*i*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			span0 = element("span");
    			if_block.c();
    			t2 = space();
    			span3 = element("span");
    			span1 = element("span");
    			i0 = element("i");
    			t3 = space();
    			span2 = element("span");
    			i1 = element("i");
    			t4 = space();
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*wish*/ ctx[4].category].title.toLowerCase().split(' ').join('_') + "/" + (/*wish*/ ctx[4].title + ' ' + /*wish*/ ctx[4].version).toLowerCase().split(' ').join('_'));
    			add_location(a, file$7, 42, 24, 1288);
    			attr_dev(td0, "class", "svelte-1g3qcvf");
    			add_location(td0, file$7, 42, 20, 1284);
    			attr_dev(span0, "class", "price-num");
    			add_location(span0, file$7, 44, 24, 1555);
    			attr_dev(i0, "class", "fas fa-cart-plus svelte-1g3qcvf");
    			add_location(i0, file$7, 54, 32, 2210);
    			attr_dev(span1, "class", "add-to-cart icon svelte-1g3qcvf");
    			add_location(span1, file$7, 53, 28, 2091);
    			attr_dev(i1, "class", "fas fa-trash svelte-1g3qcvf");
    			add_location(i1, file$7, 57, 32, 2424);
    			attr_dev(span2, "class", "remove-from-wishlist icon svelte-1g3qcvf");
    			add_location(span2, file$7, 56, 28, 2309);
    			attr_dev(span3, "class", "icons svelte-1g3qcvf");
    			add_location(span3, file$7, 52, 24, 2041);
    			attr_dev(td1, "class", "price svelte-1g3qcvf");
    			add_location(td1, file$7, 43, 20, 1511);
    			attr_dev(tr, "class", "wish-item svelte-1g3qcvf");
    			add_location(tr, file$7, 41, 16, 1240);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, span0);
    			if_block.m(span0, null);
    			append_dev(td1, t2);
    			append_dev(td1, span3);
    			append_dev(span3, span1);
    			append_dev(span1, i0);
    			append_dev(span3, t3);
    			append_dev(span3, span2);
    			append_dev(span2, i1);
    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", click_handler, false, false, false),
    					listen_dev(span2, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*wishlist*/ 1 && t0_value !== (t0_value = /*wish*/ ctx[4].title + ' ' + /*wish*/ ctx[4].version + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*wishlist*/ 1 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*wish*/ ctx[4].category].title.toLowerCase().split(' ').join('_') + "/" + (/*wish*/ ctx[4].title + ' ' + /*wish*/ ctx[4].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(41:12) {#each wishlist as wish, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let t0;
    	let main;
    	let div2;
    	let div0;
    	let t2;
    	let div1;
    	let a;
    	let t4;
    	let span;
    	let t6;
    	let div7;
    	let div3;
    	let t7;
    	let t8_value = /*wishlist*/ ctx[0].length + "";
    	let t8;
    	let t9;
    	let t10;
    	let div6;
    	let div4;
    	let t11;
    	let div5;
    	let t12;
    	let table;
    	let t13;
    	let if_block = /*wishlist*/ ctx[0].length > 0 && create_if_block_1$3(ctx);
    	let each_value = /*wishlist*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "Wishlist";
    			t2 = space();
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "Domov";
    			t4 = text(" / ");
    			span = element("span");
    			span.textContent = "Wishlist";
    			t6 = space();
    			div7 = element("div");
    			div3 = element("div");
    			t7 = text("Tvoj wishlist  (");
    			t8 = text(t8_value);
    			t9 = text(")");
    			t10 = space();
    			div6 = element("div");
    			div4 = element("div");
    			t11 = space();
    			div5 = element("div");
    			t12 = space();
    			table = element("table");
    			if (if_block) if_block.c();
    			t13 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			document.title = "Tvoj wishlist";
    			attr_dev(div0, "class", "title svelte-1g3qcvf");
    			add_location(div0, file$7, 22, 8, 588);
    			attr_dev(a, "href", "./#");
    			add_location(a, file$7, 24, 12, 662);
    			attr_dev(span, "class", "blue");
    			add_location(span, file$7, 24, 38, 688);
    			attr_dev(div1, "class", "nav svelte-1g3qcvf");
    			add_location(div1, file$7, 23, 8, 631);
    			attr_dev(div2, "class", "title-container svelte-1g3qcvf");
    			add_location(div2, file$7, 21, 4, 549);
    			attr_dev(div3, "class", "wish-title svelte-1g3qcvf");
    			add_location(div3, file$7, 28, 8, 798);
    			attr_dev(div4, "class", "blue-line svelte-1g3qcvf");
    			add_location(div4, file$7, 30, 12, 905);
    			attr_dev(div5, "class", "line svelte-1g3qcvf");
    			add_location(div5, file$7, 31, 12, 948);
    			attr_dev(div6, "class", "lines svelte-1g3qcvf");
    			add_location(div6, file$7, 29, 8, 872);
    			attr_dev(table, "class", "svelte-1g3qcvf");
    			add_location(table, file$7, 33, 8, 998);
    			attr_dev(div7, "class", "container wishlist");
    			add_location(div7, file$7, 27, 4, 756);
    			attr_dev(main, "class", "svelte-1g3qcvf");
    			add_location(main, file$7, 20, 0, 537);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(main, t6);
    			append_dev(main, div7);
    			append_dev(div7, div3);
    			append_dev(div3, t7);
    			append_dev(div3, t8);
    			append_dev(div3, t9);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div7, t12);
    			append_dev(div7, table);
    			if (if_block) if_block.m(table, null);
    			append_dev(table, t13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(table, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*wishlist*/ 1 && t8_value !== (t8_value = /*wishlist*/ ctx[0].length + "")) set_data_dev(t8, t8_value);

    			if (/*wishlist*/ ctx[0].length > 0) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(table, t13);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*removeItemFromWish, addToCart, wishlist, categories*/ 1) {
    				each_value = /*wishlist*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block_1$1(ctx);
    					each_1_else.c();
    					each_1_else.m(table, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let wishlist;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wishlist', slots, []);

    	function IsCartChanged() {
    		$$invalidate(0, wishlist = JSON.parse(localStorage.getItem("wishlist"))
    		? JSON.parse(localStorage.getItem("wishlist"))
    		: []);

    		setTimeout(
    			() => {
    				IsCartChanged();
    			},
    			100
    		);
    	}

    	IsCartChanged();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wishlist> was created with unknown prop '${key}'`);
    	});

    	const click_handler = wish => addToCart(wish, wish.colors[0], 1);
    	const click_handler_1 = i => removeItemFromWish(i);

    	$$self.$capture_state = () => ({
    		addToCart,
    		removeItemFromWish,
    		categories,
    		IsCartChanged,
    		wishlist
    	});

    	$$self.$inject_state = $$props => {
    		if ('wishlist' in $$props) $$invalidate(0, wishlist = $$props.wishlist);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, wishlist = JSON.parse(localStorage.getItem("wishlist"))
    	? JSON.parse(localStorage.getItem("wishlist"))
    	: []);

    	return [wishlist, click_handler, click_handler_1];
    }

    class Wishlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wishlist",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\routes\Search.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\routes\\Search.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (59:16) {#if searched_items_categories.length != 0}
    function create_if_block_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Kateg??rie";
    			attr_dev(div, "class", "results-title svelte-8sqe7w");
    			add_location(div, file$6, 59, 20, 2088);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(59:16) {#if searched_items_categories.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (64:16) {#each searched_items_categories as category}
    function create_each_block_1$1(ctx) {
    	let a;
    	let div0;
    	let i;
    	let t0;
    	let div1;
    	let t1_value = /*category*/ ctx[9].title + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "fas fa-folder-open svelte-8sqe7w");
    			add_location(i, file$6, 65, 51, 2427);
    			attr_dev(div0, "class", "category-icon svelte-8sqe7w");
    			add_location(div0, file$6, 65, 24, 2400);
    			attr_dev(div1, "class", "result-title svelte-8sqe7w");
    			add_location(div1, file$6, 66, 24, 2493);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + /*category*/ ctx[9].title.toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "category svelte-8sqe7w");
    			add_location(a, file$6, 64, 20, 2286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, i);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searched_items_categories*/ 2 && t1_value !== (t1_value = /*category*/ ctx[9].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*searched_items_categories*/ 2 && a_href_value !== (a_href_value = "#/obchod/" + /*category*/ ctx[9].title.toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(64:16) {#each searched_items_categories as category}",
    		ctx
    	});

    	return block;
    }

    // (72:16) {#if searched_items_products.length != 0}
    function create_if_block_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Produkty";
    			attr_dev(div, "class", "results-title svelte-8sqe7w");
    			add_location(div, file$6, 72, 20, 2729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(72:16) {#if searched_items_products.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (77:16) {#each searched_items_products as product}
    function create_each_block$3(ctx) {
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let t1_value = /*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[6].image_urls[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version);
    			attr_dev(img, "class", "svelte-8sqe7w");
    			add_location(img, file$6, 79, 28, 3188);
    			attr_dev(div0, "class", "product-img svelte-8sqe7w");
    			add_location(div0, file$6, 78, 24, 3133);
    			attr_dev(div1, "class", "result-title svelte-8sqe7w");
    			add_location(div1, file$6, 81, 24, 3327);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[6].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version).toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "product svelte-8sqe7w");
    			add_location(a, file$6, 77, 20, 2923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, img);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searched_items_products*/ 4 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[6].image_urls[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*searched_items_products*/ 4 && img_alt_value !== (img_alt_value = /*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*searched_items_products*/ 4 && t1_value !== (t1_value = /*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*searched_items_products*/ 4 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[6].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[6].title + ' ' + /*product*/ ctx[6].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(77:16) {#each searched_items_products as product}",
    		ctx
    	});

    	return block;
    }

    // (87:16) {#if searched_items_categories.length == 0 && searched_items_products == 0}
    function create_if_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Neboli najden?? ??iadne v??sledky";
    			attr_dev(div, "class", "nothing-title svelte-8sqe7w");
    			add_location(div, file$6, 87, 20, 3620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(87:16) {#if searched_items_categories.length == 0 && searched_items_products == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let title_value;
    	let t0;
    	let main;
    	let div5;
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let div4;
    	let a;
    	let div2;
    	let t5;
    	let div3;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	document.title = title_value = "V??sledky vyh??adadvnia pre: " + /*search_value*/ ctx[0];
    	let if_block0 = /*searched_items_categories*/ ctx[1].length != 0 && create_if_block_2$1(ctx);
    	let each_value_1 = /*searched_items_categories*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let if_block1 = /*searched_items_products*/ ctx[2].length != 0 && create_if_block_1$2(ctx);
    	let each_value = /*searched_items_products*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let if_block2 = /*searched_items_categories*/ ctx[1].length == 0 && /*searched_items_products*/ ctx[2] == 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = text("V??sledky vyh??adavanie pre: ");
    			t2 = text(/*search_value*/ ctx[0]);
    			t3 = space();
    			div4 = element("div");
    			a = element("a");
    			div2 = element("div");
    			div2.textContent = "Vr??ti?? sa na domovsk?? str??nku";
    			t5 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t6 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "title svelte-8sqe7w");
    			add_location(div0, file$6, 49, 12, 1679);
    			attr_dev(div1, "class", "title-container svelte-8sqe7w");
    			add_location(div1, file$6, 48, 8, 1636);
    			attr_dev(div2, "class", "button svelte-8sqe7w");
    			add_location(div2, file$6, 53, 16, 1857);
    			attr_dev(a, "href", "./#");
    			attr_dev(a, "class", "button-a svelte-8sqe7w");
    			add_location(a, file$6, 52, 12, 1808);
    			attr_dev(div3, "class", "results svelte-8sqe7w");
    			add_location(div3, file$6, 57, 12, 1984);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$6, 51, 8, 1771);
    			attr_dev(div5, "class", "search-container svelte-8sqe7w");
    			add_location(div5, file$6, 47, 4, 1596);
    			add_location(main, file$6, 46, 0, 1584);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    			append_dev(a, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t6);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div3, t7);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t9);
    			if (if_block2) if_block2.m(div3, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*search_value*/ 1 && title_value !== (title_value = "V??sledky vyh??adadvnia pre: " + /*search_value*/ ctx[0])) {
    				document.title = title_value;
    			}

    			if (dirty & /*search_value*/ 1) set_data_dev(t2, /*search_value*/ ctx[0]);

    			if (/*searched_items_categories*/ ctx[1].length != 0) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div3, t6);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*searched_items_categories*/ 2) {
    				each_value_1 = /*searched_items_categories*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div3, t7);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (/*searched_items_products*/ ctx[2].length != 0) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t8);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*categories, searched_items_products*/ 4) {
    				each_value = /*searched_items_products*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, t9);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*searched_items_categories*/ ctx[1].length == 0 && /*searched_items_products*/ ctx[2] == 0) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let { params = {} } = $$props;
    	let search_value = params.search_value;
    	let searched_items_categories = [];
    	let searched_items_products = [];

    	function isParamsChanged() {
    		$$invalidate(0, search_value = params.search_value);
    		search();

    		setInterval(
    			() => {
    				isParamsChanged();
    			},
    			100
    		);
    	}

    	isParamsChanged();

    	function search() {
    		$$invalidate(1, searched_items_categories = []);

    		if (search_value.length > 0) {
    			for (let i = 0; i < categories.length; i++) {
    				if (categories[i].title.toLowerCase().includes(search_value.toLowerCase())) {
    					searched_items_categories.push(categories[i]);
    				}
    			}
    		}

    		$$invalidate(2, searched_items_products = []);

    		if (search_value.length > 0) {
    			for (let i = 0; i < products.length; i++) {
    				if (products[i].title.toLowerCase().includes(search_value.toLowerCase()) || categories[products[i].category].title.toLowerCase().includes(search_value.toLowerCase()) || products[i].version.toLowerCase().includes(search_value.toLowerCase()) || products[i].producer.toLowerCase().includes(search_value.toLowerCase())) {
    					searched_items_products.push(products[i]);
    				}
    			}
    		}
    	}

    	const writable_props = ['params'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('params' in $$props) $$invalidate(3, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		params,
    		products,
    		categories,
    		search_value,
    		searched_items_categories,
    		searched_items_products,
    		isParamsChanged,
    		search
    	});

    	$$self.$inject_state = $$props => {
    		if ('params' in $$props) $$invalidate(3, params = $$props.params);
    		if ('search_value' in $$props) $$invalidate(0, search_value = $$props.search_value);
    		if ('searched_items_categories' in $$props) $$invalidate(1, searched_items_categories = $$props.searched_items_categories);
    		if ('searched_items_products' in $$props) $$invalidate(2, searched_items_products = $$props.searched_items_products);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*params*/ 8) {
    			{
    				window.scrollTo(0, 0);
    			}
    		}
    	};

    	return [search_value, searched_items_categories, searched_items_products, params];
    }

    class Search$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { params: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get params() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BackToTop.svelte generated by Svelte v3.46.4 */

    const file$5 = "src\\components\\BackToTop.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-arrow-up svelte-1tg3b6s");
    			add_location(i, file$5, 66, 55, 1513);
    			attr_dev(div, "class", "back-to-top svelte-1tg3b6s");
    			toggle_class(div, "hidden", /*hidden*/ ctx[0]);
    			add_location(div, file$5, 66, 0, 1458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", /*handleOnScroll*/ ctx[1], false, false, false),
    					listen_dev(div, "click", goTop, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hidden*/ 1) {
    				toggle_class(div, "hidden", /*hidden*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goTop() {
    	document.body.scrollIntoView();
    }

    function scrollContainer() {
    	return document.documentElement || document.body;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BackToTop', slots, []);
    	let { showOnPx = 150 } = $$props;
    	let hidden = true;

    	function handleOnScroll() {
    		if (!scrollContainer()) {
    			return;
    		}

    		if (scrollContainer().scrollTop > showOnPx) {
    			$$invalidate(0, hidden = false);
    		} else {
    			$$invalidate(0, hidden = true);
    		}
    	}

    	const writable_props = ['showOnPx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BackToTop> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('showOnPx' in $$props) $$invalidate(2, showOnPx = $$props.showOnPx);
    	};

    	$$self.$capture_state = () => ({
    		showOnPx,
    		hidden,
    		goTop,
    		scrollContainer,
    		handleOnScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('showOnPx' in $$props) $$invalidate(2, showOnPx = $$props.showOnPx);
    		if ('hidden' in $$props) $$invalidate(0, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hidden, handleOnScroll, showOnPx];
    }

    class BackToTop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { showOnPx: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BackToTop",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get showOnPx() {
    		throw new Error("<BackToTop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showOnPx(value) {
    		throw new Error("<BackToTop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Cart.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\components\\Cart.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (20:1) {#if show}
    function create_if_block$3(ctx) {
    	let div7;
    	let div6;
    	let div2;
    	let div0;
    	let t0;
    	let t1_value = /*cart*/ ctx[1].length + "";
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let i;
    	let t4;
    	let div3;
    	let t5;
    	let div4;
    	let span;
    	let t7;
    	let b;
    	let t8_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "";
    	let t8;
    	let t9;
    	let t10;
    	let a;
    	let div5;
    	let mounted;
    	let dispose;
    	let each_value = /*cart*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("M??j ko????k (");
    			t1 = text(t1_value);
    			t2 = text(")");
    			t3 = space();
    			div1 = element("div");
    			i = element("i");
    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t5 = space();
    			div4 = element("div");
    			span = element("span");
    			span.textContent = "SPOLU";
    			t7 = space();
    			b = element("b");
    			t8 = text(t8_value);
    			t9 = text(" ???");
    			t10 = space();
    			a = element("a");
    			div5 = element("div");
    			div5.textContent = "Prejs?? do ko????ka";
    			attr_dev(div0, "class", "top-title");
    			add_location(div0, file$4, 23, 5, 466);
    			attr_dev(i, "class", "fas fa-times");
    			add_location(i, file$4, 24, 52, 574);
    			attr_dev(div1, "class", "quit svelte-1im2o9t");
    			add_location(div1, file$4, 24, 5, 527);
    			attr_dev(div2, "class", "top svelte-1im2o9t");
    			add_location(div2, file$4, 22, 4, 442);
    			attr_dev(div3, "class", "products");
    			add_location(div3, file$4, 26, 4, 626);
    			add_location(span, file$4, 52, 5, 1930);
    			add_location(b, file$4, 53, 5, 1955);
    			attr_dev(div4, "class", "total svelte-1im2o9t");
    			add_location(div4, file$4, 51, 4, 1904);
    			attr_dev(div5, "class", "button-to-cart svelte-1im2o9t");
    			add_location(div5, file$4, 56, 5, 2114);
    			attr_dev(a, "href", "#/kosik");
    			attr_dev(a, "class", "button-to-cart-a svelte-1im2o9t");
    			add_location(a, file$4, 55, 4, 2035);
    			attr_dev(div6, "class", "cart-container svelte-1im2o9t");
    			add_location(div6, file$4, 21, 3, 408);
    			attr_dev(div7, "class", "full-page-container svelte-1im2o9t");
    			add_location(div7, file$4, 20, 2, 370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, i);
    			append_dev(div6, t4);
    			append_dev(div6, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div3, null);
    			}

    			append_dev(div6, t5);
    			append_dev(div6, div4);
    			append_dev(div4, span);
    			append_dev(div4, t7);
    			append_dev(div4, b);
    			append_dev(b, t8);
    			append_dev(b, t9);
    			append_dev(div6, t10);
    			append_dev(div6, a);
    			append_dev(a, div5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*hideCartPreview*/ ctx[3], false, false, false),
    					listen_dev(a, "click", /*hideCartPreview*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart*/ 2 && t1_value !== (t1_value = /*cart*/ ctx[1].length + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*removeItemFromCart, cart, categories, hideCartPreview*/ 10) {
    				each_value = /*cart*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block_1(ctx);
    					each_1_else.c();
    					each_1_else.m(div3, null);
    				}
    			}

    			if (dirty & /*totalSum*/ 4 && t8_value !== (t8_value = /*totalSum*/ ctx[2].toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(20:1) {#if show}",
    		ctx
    	});

    	return block;
    }

    // (46:5) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Ko????k neobsahuje ??iadne produkty\r\n\t\t\t\t\t\t";
    			attr_dev(div, "class", "product svelte-1im2o9t");
    			add_location(div, file$4, 46, 6, 1796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(46:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:9) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let t0_value = /*product*/ ctx[5][2] + "";
    	let t0;
    	let t1;
    	let t2_value = /*product*/ ctx[5][0].price.toFixed(2).toString().split('.').join(',') + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("x");
    			t2 = text(t2_value);
    			t3 = text(" ???");
    			attr_dev(div, "class", "p-price svelte-1im2o9t");
    			add_location(div, file$4, 39, 11, 1493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart*/ 2 && t0_value !== (t0_value = /*product*/ ctx[5][2] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*cart*/ 2 && t2_value !== (t2_value = /*product*/ ctx[5][0].price.toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(39:9) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:9) {#if product[0].discount_bollean}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t0_value = /*product*/ ctx[5][2] + "";
    	let t0;
    	let t1;
    	let t2_value = /*product*/ ctx[5][0].discount_price.toFixed(2).toString().split('.').join(',') + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text("x");
    			t2 = text(t2_value);
    			t3 = text(" ???");
    			attr_dev(div, "class", "p-price svelte-1im2o9t");
    			add_location(div, file$4, 37, 10, 1350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart*/ 2 && t0_value !== (t0_value = /*product*/ ctx[5][2] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*cart*/ 2 && t2_value !== (t2_value = /*product*/ ctx[5][0].discount_price.toFixed(2).toString().split('.').join(',') + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(37:9) {#if product[0].discount_bollean}",
    		ctx
    	});

    	return block;
    }

    // (28:5) {#each cart as product}
    function create_each_block$2(ctx) {
    	let div6;
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div3;
    	let div1;
    	let a;
    	let t1_value = /*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version + "";
    	let t1;
    	let a_href_value;
    	let t2;
    	let div2;
    	let t3_value = /*product*/ ctx[5][1].title + "";
    	let t3;
    	let t4;
    	let t5;
    	let div5;
    	let i;
    	let t6;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*product*/ ctx[5][0].discount_bollean) return create_if_block_1$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			a = element("a");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			if_block.c();
    			t5 = space();
    			div5 = element("div");
    			i = element("i");
    			t6 = space();
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[5][0].image_urls[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version);
    			attr_dev(img, "class", "svelte-1im2o9t");
    			add_location(img, file$4, 31, 9, 793);
    			attr_dev(div0, "class", "img-product svelte-1im2o9t");
    			add_location(div0, file$4, 30, 8, 757);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[5][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version).toLowerCase().split(' ').join('_'));
    			add_location(a, file$4, 34, 30, 977);
    			attr_dev(div1, "class", "p-title svelte-1im2o9t");
    			add_location(div1, file$4, 34, 9, 956);
    			attr_dev(div2, "class", "p-color svelte-1im2o9t");
    			add_location(div2, file$4, 35, 9, 1249);
    			attr_dev(div3, "class", "product-info-container svelte-1im2o9t");
    			add_location(div3, file$4, 33, 8, 909);
    			attr_dev(div4, "class", "product-container svelte-1im2o9t");
    			add_location(div4, file$4, 29, 7, 716);
    			attr_dev(i, "class", "fas fa-trash");
    			add_location(i, file$4, 43, 81, 1726);
    			attr_dev(div5, "class", "trash svelte-1im2o9t");
    			add_location(div5, file$4, 43, 7, 1652);
    			attr_dev(div6, "class", "product svelte-1im2o9t");
    			add_location(div6, file$4, 28, 6, 686);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, a);
    			append_dev(a, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div3, t4);
    			if_block.m(div3, null);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, i);
    			append_dev(div6, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*hideCartPreview*/ ctx[3], false, false, false),
    					listen_dev(
    						div5,
    						"click",
    						function () {
    							if (is_function(removeItemFromCart(/*cart*/ ctx[1].indexOf(/*product*/ ctx[5])))) removeItemFromCart(/*cart*/ ctx[1].indexOf(/*product*/ ctx[5])).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*cart*/ 2 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[5][0].image_urls[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*cart*/ 2 && img_alt_value !== (img_alt_value = /*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*cart*/ 2 && t1_value !== (t1_value = /*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*cart*/ 2 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[5][0].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[5][0].title + ' ' + /*product*/ ctx[5][0].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*cart*/ 2 && t3_value !== (t3_value = /*product*/ ctx[5][1].title + "")) set_data_dev(t3, t3_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(28:5) {#each cart as product}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			add_location(main, file$4, 18, 0, 317);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);

    			if (!mounted) {
    				dispose = listen_dev(main, "load", /*hideCartPreview*/ ctx[3](), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cart', slots, []);
    	let { show } = $$props;
    	let { random_num } = $$props;
    	let { cart } = $$props;
    	let { totalSum } = $$props;

    	function hideCartPreview() {
    		$$invalidate(0, show = false);
    	}

    	const writable_props = ['show', 'random_num', 'cart', 'totalSum'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(4, random_num = $$props.random_num);
    		if ('cart' in $$props) $$invalidate(1, cart = $$props.cart);
    		if ('totalSum' in $$props) $$invalidate(2, totalSum = $$props.totalSum);
    	};

    	$$self.$capture_state = () => ({
    		categories,
    		show,
    		random_num,
    		cart,
    		totalSum,
    		hideCartPreview,
    		removeItemFromCart
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(4, random_num = $$props.random_num);
    		if ('cart' in $$props) $$invalidate(1, cart = $$props.cart);
    		if ('totalSum' in $$props) $$invalidate(2, totalSum = $$props.totalSum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*random_num*/ 16) {
    			{
    				$$invalidate(0, show = true);
    			}
    		}
    	};

    	return [show, cart, totalSum, hideCartPreview, random_num];
    }

    class Cart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			show: 0,
    			random_num: 4,
    			cart: 1,
    			totalSum: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*show*/ ctx[0] === undefined && !('show' in props)) {
    			console.warn("<Cart> was created without expected prop 'show'");
    		}

    		if (/*random_num*/ ctx[4] === undefined && !('random_num' in props)) {
    			console.warn("<Cart> was created without expected prop 'random_num'");
    		}

    		if (/*cart*/ ctx[1] === undefined && !('cart' in props)) {
    			console.warn("<Cart> was created without expected prop 'cart'");
    		}

    		if (/*totalSum*/ ctx[2] === undefined && !('totalSum' in props)) {
    			console.warn("<Cart> was created without expected prop 'totalSum'");
    		}
    	}

    	get show() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get random_num() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set random_num(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cart() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cart(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalSum() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalSum(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Search.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\Search.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (73:16) {:else}
    function create_else_block$1(ctx) {
    	let a;
    	let i;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-search svelte-1phem1b");
    			add_location(i, file$3, 74, 24, 2784);
    			attr_dev(a, "href", a_href_value = "./#/vyhladavanie=/" + /*search_value*/ ctx[0]);
    			attr_dev(a, "class", "icon svelte-1phem1b");
    			attr_dev(a, "type", "submit");
    			add_location(a, file$3, 73, 20, 2637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*hideSearch*/ ctx[5], false, false, false),
    					listen_dev(a, "click", window.reload, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*search_value*/ 1 && a_href_value !== (a_href_value = "./#/vyhladavanie=/" + /*search_value*/ ctx[0])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(73:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:16) {#if search_value.length == 0}
    function create_if_block_3(ctx) {
    	let div;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-search svelte-1phem1b");
    			add_location(i, file$3, 70, 24, 2533);
    			attr_dev(div, "class", "icon svelte-1phem1b");
    			add_location(div, file$3, 69, 20, 2465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*emptyValue*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(69:16) {#if search_value.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (81:12) {#if searched_items_categories.length != 0}
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Kateg??rie";
    			attr_dev(div, "class", "results-title svelte-1phem1b");
    			add_location(div, file$3, 81, 16, 3005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(81:12) {#if searched_items_categories.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (86:12) {#each searched_items_categories as category}
    function create_each_block_1(ctx) {
    	let a;
    	let div0;
    	let i;
    	let t0;
    	let div1;
    	let t1_value = /*category*/ ctx[15].title + "";
    	let t1;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "fas fa-folder-open svelte-1phem1b");
    			add_location(i, file$3, 87, 47, 3371);
    			attr_dev(div0, "class", "category-icon svelte-1phem1b");
    			add_location(div0, file$3, 87, 20, 3344);
    			attr_dev(div1, "class", "result-title svelte-1phem1b");
    			add_location(div1, file$3, 88, 20, 3433);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + /*category*/ ctx[15].title.toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "category svelte-1phem1b");
    			add_location(a, file$3, 86, 16, 3183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, i);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*hideSearch*/ ctx[5], false, false, false),
    					listen_dev(a, "click", window.reload, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searched_items_categories*/ 4 && t1_value !== (t1_value = /*category*/ ctx[15].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*searched_items_categories*/ 4 && a_href_value !== (a_href_value = "#/obchod/" + /*category*/ ctx[15].title.toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(86:12) {#each searched_items_categories as category}",
    		ctx
    	});

    	return block;
    }

    // (94:12) {#if searched_items_products.length != 0}
    function create_if_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Produkty";
    			attr_dev(div, "class", "results-title svelte-1phem1b");
    			add_location(div, file$3, 94, 16, 3645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(94:12) {#if searched_items_products.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (99:12) {#each searched_items_products as product}
    function create_each_block$1(ctx) {
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let t1_value = /*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version + "";
    	let t1;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			if (!src_url_equal(img.src, img_src_value = /*product*/ ctx[12].image_urls[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version);
    			attr_dev(img, "class", "svelte-1phem1b");
    			add_location(img, file$3, 101, 24, 4127);
    			attr_dev(div0, "class", "product-img svelte-1phem1b");
    			add_location(div0, file$3, 100, 20, 4076);
    			attr_dev(div1, "class", "result-title svelte-1phem1b");
    			add_location(div1, file$3, 103, 20, 4258);
    			attr_dev(a, "href", a_href_value = "#/obchod/" + categories[/*product*/ ctx[12].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version).toLowerCase().split(' ').join('_'));
    			attr_dev(a, "class", "product svelte-1phem1b");
    			add_location(a, file$3, 99, 16, 3819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, img);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*hideSearch*/ ctx[5], false, false, false),
    					listen_dev(a, "click", window.reload, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*searched_items_products*/ 8 && !src_url_equal(img.src, img_src_value = /*product*/ ctx[12].image_urls[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*searched_items_products*/ 8 && img_alt_value !== (img_alt_value = /*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*searched_items_products*/ 8 && t1_value !== (t1_value = /*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*searched_items_products*/ 8 && a_href_value !== (a_href_value = "#/obchod/" + categories[/*product*/ ctx[12].category].title.toLowerCase().split(' ').join('_') + "/" + (/*product*/ ctx[12].title + ' ' + /*product*/ ctx[12].version).toLowerCase().split(' ').join('_'))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(99:12) {#each searched_items_products as product}",
    		ctx
    	});

    	return block;
    }

    // (109:12) {#if searched_items_categories.length == 0 && searched_items_products == 0 && search_value != 0}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Neboli najden?? ??iadne v??sledky";
    			attr_dev(div, "class", "nothing-title svelte-1phem1b");
    			add_location(div, file$3, 109, 16, 4548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(109:12) {#if searched_items_categories.length == 0 && searched_items_products == 0 && search_value != 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let form;
    	let div2;
    	let input;
    	let input_class_value;
    	let t2;
    	let t3;
    	let div3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let div4;
    	let i;
    	let div5_class_value;
    	let main_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*search_value*/ ctx[0].length == 0) return create_if_block_3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*searched_items_categories*/ ctx[2].length != 0 && create_if_block_2(ctx);
    	let each_value_1 = /*searched_items_categories*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block2 = /*searched_items_products*/ ctx[3].length != 0 && create_if_block_1(ctx);
    	let each_value = /*searched_items_products*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block3 = /*searched_items_categories*/ ctx[2].length == 0 && /*searched_items_products*/ ctx[3] == 0 && /*search_value*/ ctx[0] != 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			form = element("form");
    			div2 = element("div");
    			input = element("input");
    			t2 = text(">\r\n                ");
    			if_block0.c();
    			t3 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t4 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			if (if_block3) if_block3.c();
    			t8 = space();
    			div4 = element("div");
    			i = element("i");
    			attr_dev(div0, "class", "background-1 background svelte-1phem1b");
    			add_location(div0, file$3, 62, 4, 2012);
    			attr_dev(div1, "class", "background-2 background svelte-1phem1b");
    			add_location(div1, file$3, 63, 4, 2061);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Vyh??adava??...");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*red_text*/ ctx[4] ? 'red' : '') + " svelte-1phem1b"));
    			add_location(input, file$3, 67, 16, 2289);
    			attr_dev(div2, "class", "input svelte-1phem1b");
    			add_location(div2, file$3, 66, 12, 2252);
    			attr_dev(form, "action", "javascript:void(0);");
    			add_location(form, file$3, 65, 8, 2203);
    			attr_dev(div3, "class", "results svelte-1phem1b");
    			add_location(div3, file$3, 79, 8, 2909);
    			attr_dev(i, "class", "fas fa-times svelte-1phem1b");
    			add_location(i, file$3, 113, 12, 4720);
    			attr_dev(div4, "class", "quit svelte-1phem1b");
    			add_location(div4, file$3, 112, 8, 4656);
    			attr_dev(div5, "class", div5_class_value = "search-container background " + (/*search_value*/ ctx[0].length > 0 ? 'active' : '') + " svelte-1phem1b");
    			add_location(div5, file$3, 64, 4, 2110);
    			attr_dev(main, "class", main_class_value = "search " + (/*show_search*/ ctx[1] ? 'active' : '') + " svelte-1phem1b");
    			add_location(main, file$3, 61, 0, 1930);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(main, t1);
    			append_dev(main, div5);
    			append_dev(div5, form);
    			append_dev(form, div2);
    			append_dev(div2, input);
    			set_input_value(input, /*search_value*/ ctx[0]);
    			append_dev(div2, t2);
    			if_block0.m(div2, null);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div3, t5);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t7);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, i);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(div4, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(main, "load", /*hideSearch*/ ctx[5](), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*red_text*/ 16 && input_class_value !== (input_class_value = "" + (null_to_empty(/*red_text*/ ctx[4] ? 'red' : '') + " svelte-1phem1b"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*search_value*/ 1 && input.value !== /*search_value*/ ctx[0]) {
    				set_input_value(input, /*search_value*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			}

    			if (/*searched_items_categories*/ ctx[2].length != 0) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div3, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*searched_items_categories, hideSearch, window*/ 36) {
    				each_value_1 = /*searched_items_categories*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div3, t5);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (/*searched_items_products*/ ctx[3].length != 0) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div3, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*categories, searched_items_products, hideSearch, window*/ 40) {
    				each_value = /*searched_items_products*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, t7);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*searched_items_categories*/ ctx[2].length == 0 && /*searched_items_products*/ ctx[3] == 0 && /*search_value*/ ctx[0] != 0) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block$2(ctx);
    					if_block3.c();
    					if_block3.m(div3, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*search_value*/ 1 && div5_class_value !== (div5_class_value = "search-container background " + (/*search_value*/ ctx[0].length > 0 ? 'active' : '') + " svelte-1phem1b")) {
    				attr_dev(div5, "class", div5_class_value);
    			}

    			if (dirty & /*show_search*/ 2 && main_class_value !== (main_class_value = "search " + (/*show_search*/ ctx[1] ? 'active' : '') + " svelte-1phem1b")) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let { random_num_search } = $$props;
    	let show_search = false;
    	document.addEventListener('keydown', keyPush);

    	function keyPush(event) {
    		switch (event.key) {
    			case 'Enter':
    				if (search_value.length > 0) {
    					hideSearch();
    					window.location.href = "#/vyhladavanie=/" + search_value;
    				} else {
    					emptyValue();
    				}
    				break;
    		}
    	}

    	function hideSearch() {
    		$$invalidate(1, show_search = false);
    	}

    	let search_value = '';
    	let searched_items_categories = [];
    	let searched_items_products = [];
    	let red_text = false;

    	function search() {
    		$$invalidate(4, red_text = false);
    		$$invalidate(2, searched_items_categories = []);

    		if (search_value.length > 0) {
    			for (let i = 0; i < categories.length; i++) {
    				if (categories[i].title.toLowerCase().includes(search_value.toLowerCase())) {
    					searched_items_categories.push(categories[i]);
    				}
    			}
    		}

    		$$invalidate(3, searched_items_products = []);

    		if (search_value.length > 0) {
    			for (let i = 0; i < products.length; i++) {
    				if (products[i].title.toLowerCase().includes(search_value.toLowerCase()) || categories[products[i].category].title.toLowerCase().includes(search_value.toLowerCase()) || products[i].version.toLowerCase().includes(search_value.toLowerCase()) || products[i].producer.toLowerCase().includes(search_value.toLowerCase())) {
    					searched_items_products.push(products[i]);
    				}
    			}
    		}
    	}

    	function emptyValue() {
    		$$invalidate(4, red_text = true);
    	}

    	const writable_props = ['random_num_search'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search_value = this.value;
    		$$invalidate(0, search_value);
    	}

    	const click_handler = () => hideSearch();

    	$$self.$$set = $$props => {
    		if ('random_num_search' in $$props) $$invalidate(7, random_num_search = $$props.random_num_search);
    	};

    	$$self.$capture_state = () => ({
    		products,
    		categories,
    		random_num_search,
    		show_search,
    		keyPush,
    		hideSearch,
    		search_value,
    		searched_items_categories,
    		searched_items_products,
    		red_text,
    		search,
    		emptyValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('random_num_search' in $$props) $$invalidate(7, random_num_search = $$props.random_num_search);
    		if ('show_search' in $$props) $$invalidate(1, show_search = $$props.show_search);
    		if ('search_value' in $$props) $$invalidate(0, search_value = $$props.search_value);
    		if ('searched_items_categories' in $$props) $$invalidate(2, searched_items_categories = $$props.searched_items_categories);
    		if ('searched_items_products' in $$props) $$invalidate(3, searched_items_products = $$props.searched_items_products);
    		if ('red_text' in $$props) $$invalidate(4, red_text = $$props.red_text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*random_num_search*/ 128) {
    			{
    				$$invalidate(1, show_search = true);
    			}
    		}

    		if ($$self.$$.dirty & /*search_value*/ 1) {
    			{
    				search();
    			}
    		}
    	};

    	return [
    		search_value,
    		show_search,
    		searched_items_categories,
    		searched_items_products,
    		red_text,
    		hideSearch,
    		emptyValue,
    		random_num_search,
    		input_input_handler,
    		click_handler
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { random_num_search: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*random_num_search*/ ctx[7] === undefined && !('random_num_search' in props)) {
    			console.warn("<Search> was created without expected prop 'random_num_search'");
    		}
    	}

    	get random_num_search() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set random_num_search(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Loader.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\components\\Loader.svelte";

    // (34:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:4) {#if !isPageLoaded}
    function create_if_block$1(ctx) {
    	let div8;
    	let div1;
    	let div0;
    	let i;
    	let t0;
    	let span;
    	let t2;
    	let div7;
    	let div2;
    	let t3;
    	let div3;
    	let t4;
    	let div4;
    	let t5;
    	let div5;
    	let t6;
    	let div6;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = text("\r\n\t\t\t\t\tElectro");
    			span = element("span");
    			span.textContent = "X";
    			t2 = space();
    			div7 = element("div");
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			t4 = space();
    			div4 = element("div");
    			t5 = space();
    			div5 = element("div");
    			t6 = space();
    			div6 = element("div");
    			attr_dev(i, "class", "fas fa-bolt svelte-xh8f1a");
    			add_location(i, file$2, 21, 5, 448);
    			attr_dev(span, "class", "x-blue svelte-xh8f1a");
    			add_location(span, file$2, 22, 12, 489);
    			attr_dev(div0, "class", "logo svelte-xh8f1a");
    			add_location(div0, file$2, 20, 16, 423);
    			attr_dev(div1, "class", "logo-conatiner svelte-xh8f1a");
    			add_location(div1, file$2, 19, 12, 377);
    			attr_dev(div2, "class", "dot svelte-xh8f1a");
    			add_location(div2, file$2, 26, 16, 608);
    			attr_dev(div3, "class", "dot svelte-xh8f1a");
    			add_location(div3, file$2, 27, 16, 649);
    			attr_dev(div4, "class", "dot svelte-xh8f1a");
    			add_location(div4, file$2, 28, 16, 690);
    			attr_dev(div5, "class", "dot svelte-xh8f1a");
    			add_location(div5, file$2, 29, 16, 731);
    			attr_dev(div6, "class", "dot svelte-xh8f1a");
    			add_location(div6, file$2, 30, 16, 772);
    			attr_dev(div7, "class", "container svelte-xh8f1a");
    			add_location(div7, file$2, 25, 12, 567);
    			attr_dev(div8, "class", "body svelte-xh8f1a");
    			add_location(div8, file$2, 18, 8, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(div8, t2);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div7, t3);
    			append_dev(div7, div3);
    			append_dev(div7, t4);
    			append_dev(div7, div4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:4) {#if !isPageLoaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*isPageLoaded*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			add_location(main, file$2, 16, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, ['default']);
    	let isPageLoaded = false;

    	function stopLoading() {
    		setTimeout(
    			() => {
    				$$invalidate(0, isPageLoaded = true);
    				window.stop();
    			},
    			4000
    		);
    	}

    	stopLoading();

    	window.addEventListener('load', function () {
    		$$invalidate(0, isPageLoaded = true);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ isPageLoaded, stopLoading });

    	$$self.$inject_state = $$props => {
    		if ('isPageLoaded' in $$props) $$invalidate(0, isPageLoaded = $$props.isPageLoaded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isPageLoaded, $$scope, slots];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Newsletter.svelte generated by Svelte v3.46.4 */

    const file$1 = "src\\components\\Newsletter.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div4;
    	let div3;
    	let div0;
    	let i;
    	let t0;
    	let div1;
    	let t2;
    	let div2;
    	let t4;
    	let a;
    	let div4_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "NEWSLETTER";
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "Prihl??ste sa k odberu n????ho newslettera a u?? v??m ni?? neujde.";
    			t4 = space();
    			a = element("a");
    			a.textContent = "Odobera?? newsletter";
    			attr_dev(i, "class", "fas fa-times");
    			add_location(i, file$1, 11, 50, 302);
    			attr_dev(div0, "class", "quit svelte-1om213j");
    			add_location(div0, file$1, 11, 12, 264);
    			attr_dev(div1, "class", "title svelte-1om213j");
    			add_location(div1, file$1, 12, 12, 350);
    			attr_dev(div2, "class", "subtitle svelte-1om213j");
    			add_location(div2, file$1, 13, 12, 399);
    			attr_dev(a, "href", "#/newsletter");
    			attr_dev(a, "class", "button svelte-1om213j");
    			add_location(a, file$1, 14, 12, 501);
    			attr_dev(div3, "class", "newsletter svelte-1om213j");
    			add_location(div3, file$1, 10, 8, 226);
    			attr_dev(div4, "class", div4_class_value = "newsletter-container " + (/*show*/ ctx[0] ? '' : 'hide') + " svelte-1om213j");
    			add_location(div4, file$1, 9, 4, 161);
    			add_location(main, file$1, 8, 0, 149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, i);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div3, t4);
    			append_dev(div3, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*hideIt*/ ctx[1], false, false, false),
    					listen_dev(a, "click", /*hideIt*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*show*/ 1 && div4_class_value !== (div4_class_value = "newsletter-container " + (/*show*/ ctx[0] ? '' : 'hide') + " svelte-1om213j")) {
    				attr_dev(div4, "class", div4_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let show;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newsletter', slots, []);

    	function hideIt() {
    		$$invalidate(0, show = false);
    		localStorage.setItem("newsletter", true);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Newsletter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ hideIt, show });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, show = true);
    	return [show, hideIt];
    }

    class Newsletter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newsletter",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { setTimeout: setTimeout_1, window: window_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (72:1) {#if !localStorage.getItem('newsletter')}
    function create_if_block(ctx) {
    	let newsletter;
    	let current;
    	newsletter = new Newsletter({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(newsletter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newsletter, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newsletter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newsletter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newsletter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(72:1) {#if !localStorage.getItem('newsletter')}",
    		ctx
    	});

    	return block;
    }

    // (146:3) {#each services as service}
    function create_each_block(ctx) {
    	let div4;
    	let div0;
    	let i;
    	let t0;
    	let div3;
    	let div1;
    	let t1_value = /*service*/ ctx[19].title + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3_value = /*service*/ ctx[19].subtitle + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(i, "class", /*service*/ ctx[19].icon);
    			add_location(i, file, 148, 6, 4639);
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file, 147, 5, 4613);
    			attr_dev(div1, "class", "s-title");
    			add_location(div1, file, 151, 6, 4723);
    			attr_dev(div2, "class", "s-subtitle");
    			add_location(div2, file, 152, 6, 4773);
    			attr_dev(div3, "class", "service-info");
    			add_location(div3, file, 150, 5, 4689);
    			attr_dev(div4, "class", "service");
    			add_location(div4, file, 146, 4, 4585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, i);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, t3);
    			append_dev(div4, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(146:3) {#each services as service}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let main;
    	let loader;
    	let t0;
    	let show_if = !localStorage.getItem('newsletter');
    	let t1;
    	let search;
    	let t2;
    	let cart_1;
    	let t3;
    	let header;
    	let div6;
    	let div2;
    	let div0;
    	let a0;
    	let i0;
    	let t4;
    	let t5;
    	let div1;
    	let a1;
    	let i1;
    	let t6;
    	let t7;
    	let div5;
    	let i4;
    	let div3;
    	let i2;
    	let t8;
    	let div4;
    	let i3;
    	let t9;
    	let nav;
    	let div15;
    	let div7;
    	let a2;
    	let i5;
    	let t10;
    	let span0;
    	let t12;
    	let div8;
    	let ul0;
    	let li0;
    	let a3;
    	let t14;
    	let li1;
    	let a4;
    	let t16;
    	let li2;
    	let a5;
    	let t18;
    	let div13;
    	let div9;
    	let a6;
    	let i6;
    	let t19;
    	let div11;
    	let i7;
    	let t20;
    	let div10;
    	let t21_value = /*cart*/ ctx[5].length + "";
    	let t21;
    	let t22;
    	let div12;
    	let i8;
    	let t23;
    	let div14;
    	let span1;
    	let t24;
    	let span2;
    	let t25;
    	let span3;
    	let nav_class_value;
    	let t26;
    	let router;
    	let t27;
    	let div17;
    	let div16;
    	let t28;
    	let footer;
    	let div37;
    	let div24;
    	let div18;
    	let a7;
    	let i9;
    	let t29;
    	let span4;
    	let t31;
    	let div23;
    	let div19;
    	let b0;
    	let t33;
    	let a8;
    	let t35;
    	let div20;
    	let b1;
    	let t37;
    	let a9;
    	let t39;
    	let div21;
    	let b2;
    	let t41;
    	let a10;
    	let t43;
    	let div22;
    	let a11;
    	let i10;
    	let t44;
    	let a12;
    	let i11;
    	let t45;
    	let a13;
    	let i12;
    	let t46;
    	let a14;
    	let i13;
    	let t47;
    	let a15;
    	let i14;
    	let t48;
    	let div28;
    	let div25;
    	let t50;
    	let div26;
    	let t51;
    	let div27;
    	let ul1;
    	let li3;
    	let a16;
    	let t53;
    	let li4;
    	let a17;
    	let t55;
    	let li5;
    	let a18;
    	let t57;
    	let li6;
    	let a19;
    	let t59;
    	let li7;
    	let a20;
    	let t61;
    	let li8;
    	let a21;
    	let t63;
    	let div32;
    	let div29;
    	let t65;
    	let div30;
    	let t66;
    	let div31;
    	let ul2;
    	let li9;
    	let a22;
    	let t68;
    	let li10;
    	let a23;
    	let t70;
    	let li11;
    	let a24;
    	let t72;
    	let li12;
    	let a25;
    	let t74;
    	let li13;
    	let a26;
    	let t76;
    	let li14;
    	let a27;
    	let t78;
    	let div36;
    	let div33;
    	let t80;
    	let div34;
    	let t81;
    	let div35;
    	let t83;
    	let form;
    	let input0;
    	let t84;
    	let input1;
    	let t85;
    	let div41;
    	let div40;
    	let div38;
    	let t86;
    	let a28;
    	let t88;
    	let a29;
    	let t90;
    	let div39;
    	let t91;
    	let a30;
    	let i15;
    	let t92;
    	let a31;
    	let i16;
    	let t93;
    	let a32;
    	let i17;
    	let t94;
    	let a33;
    	let i18;
    	let t95;
    	let a34;
    	let i19;
    	let t96;
    	let div43;
    	let t97;
    	let div42;
    	let t98;
    	let div45;
    	let t99;
    	let div44;
    	let t100;
    	let div47;
    	let t101;
    	let div46;
    	let t102;
    	let div49;
    	let t103;
    	let div48;
    	let t104;
    	let div51;
    	let t105;
    	let div50;
    	let t106;
    	let div53;
    	let t107;
    	let div52;
    	let t108;
    	let backtotop;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[10]);
    	loader = new Loader({ $$inline: true });
    	let if_block = show_if && create_if_block(ctx);

    	search = new Search({
    			props: {
    				random_num_search: /*random_num_search*/ ctx[3]
    			},
    			$$inline: true
    		});

    	cart_1 = new Cart({
    			props: {
    				show: /*show*/ ctx[1],
    				random_num: /*random_num*/ ctx[2],
    				cart: /*cart*/ ctx[5],
    				totalSum: /*totalSum*/ ctx[4]
    			},
    			$$inline: true
    		});

    	router = new Router({
    			props: { routes: /*routes*/ ctx[6] },
    			$$inline: true
    		});

    	let each_value = services;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	backtotop = new BackToTop({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(loader.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(search.$$.fragment);
    			t2 = space();
    			create_component(cart_1.$$.fragment);
    			t3 = space();
    			header = element("header");
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t4 = text("+421 234 567 890");
    			t5 = space();
    			div1 = element("div");
    			a1 = element("a");
    			i1 = element("i");
    			t6 = text("1910 Blvd, The Bronx, NY, USA");
    			t7 = space();
    			div5 = element("div");
    			i4 = element("i");
    			div3 = element("div");
    			i2 = element("i");
    			t8 = space();
    			div4 = element("div");
    			i3 = element("i");
    			t9 = space();
    			nav = element("nav");
    			div15 = element("div");
    			div7 = element("div");
    			a2 = element("a");
    			i5 = element("i");
    			t10 = text("\r\n\t\t\t\t\tElectro");
    			span0 = element("span");
    			span0.textContent = "X";
    			t12 = space();
    			div8 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			a3 = element("a");
    			a3.textContent = "Domov";
    			t14 = space();
    			li1 = element("li");
    			a4 = element("a");
    			a4.textContent = "Obchod";
    			t16 = space();
    			li2 = element("li");
    			a5 = element("a");
    			a5.textContent = "Kontakt";
    			t18 = space();
    			div13 = element("div");
    			div9 = element("div");
    			a6 = element("a");
    			i6 = element("i");
    			t19 = space();
    			div11 = element("div");
    			i7 = element("i");
    			t20 = space();
    			div10 = element("div");
    			t21 = text(t21_value);
    			t22 = space();
    			div12 = element("div");
    			i8 = element("i");
    			t23 = space();
    			div14 = element("div");
    			span1 = element("span");
    			t24 = space();
    			span2 = element("span");
    			t25 = space();
    			span3 = element("span");
    			t26 = space();
    			create_component(router.$$.fragment);
    			t27 = space();
    			div17 = element("div");
    			div16 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t28 = space();
    			footer = element("footer");
    			div37 = element("div");
    			div24 = element("div");
    			div18 = element("div");
    			a7 = element("a");
    			i9 = element("i");
    			t29 = text("\r\n\t\t\t\t\t\tElectro");
    			span4 = element("span");
    			span4.textContent = "X";
    			t31 = space();
    			div23 = element("div");
    			div19 = element("div");
    			b0 = element("b");
    			b0.textContent = "Tel. ??.:";
    			t33 = space();
    			a8 = element("a");
    			a8.textContent = "+421 234 567 890";
    			t35 = space();
    			div20 = element("div");
    			b1 = element("b");
    			b1.textContent = "Email:";
    			t37 = space();
    			a9 = element("a");
    			a9.textContent = "info@elektrox.sk";
    			t39 = space();
    			div21 = element("div");
    			b2 = element("b");
    			b2.textContent = "Adresa:";
    			t41 = space();
    			a10 = element("a");
    			a10.textContent = "1910 Blvd, The Bronx, NY, USA";
    			t43 = space();
    			div22 = element("div");
    			a11 = element("a");
    			i10 = element("i");
    			t44 = space();
    			a12 = element("a");
    			i11 = element("i");
    			t45 = space();
    			a13 = element("a");
    			i12 = element("i");
    			t46 = space();
    			a14 = element("a");
    			i13 = element("i");
    			t47 = space();
    			a15 = element("a");
    			i14 = element("i");
    			t48 = space();
    			div28 = element("div");
    			div25 = element("div");
    			div25.textContent = "Inform??cie";
    			t50 = space();
    			div26 = element("div");
    			t51 = space();
    			div27 = element("div");
    			ul1 = element("ul");
    			li3 = element("li");
    			a16 = element("a");
    			a16.textContent = "O n??s";
    			t53 = space();
    			li4 = element("li");
    			a17 = element("a");
    			a17.textContent = "Kontakt";
    			t55 = space();
    			li5 = element("li");
    			a18 = element("a");
    			a18.textContent = "Z??sady ochrany osobn??ch ??dajov";
    			t57 = space();
    			li6 = element("li");
    			a19 = element("a");
    			a19.textContent = "Podmienky";
    			t59 = space();
    			li7 = element("li");
    			a20 = element("a");
    			a20.textContent = "Inform??cie o dodan??";
    			t61 = space();
    			li8 = element("li");
    			a21 = element("a");
    			a21.textContent = "Objedn??vky a vr??tenie tovaru";
    			t63 = space();
    			div32 = element("div");
    			div29 = element("div");
    			div29.textContent = "Z??kaznik";
    			t65 = space();
    			div30 = element("div");
    			t66 = space();
    			div31 = element("div");
    			ul2 = element("ul");
    			li9 = element("li");
    			a22 = element("a");
    			a22.textContent = "Pomoc a FAQs";
    			t68 = space();
    			li10 = element("li");
    			a23 = element("a");
    			a23.textContent = "M??j ????et";
    			t70 = space();
    			li11 = element("li");
    			a24 = element("a");
    			a24.textContent = "Hist??ria objedn??vok";
    			t72 = space();
    			li12 = element("li");
    			a25 = element("a");
    			a25.textContent = "Wishlist";
    			t74 = space();
    			li13 = element("li");
    			a26 = element("a");
    			a26.textContent = "Newsletter";
    			t76 = space();
    			li14 = element("li");
    			a27 = element("a");
    			a27.textContent = "Z??sady n??kupu";
    			t78 = space();
    			div36 = element("div");
    			div33 = element("div");
    			div33.textContent = "Newsletter";
    			t80 = space();
    			div34 = element("div");
    			t81 = space();
    			div35 = element("div");
    			div35.textContent = "Prihl??ste sa k odberu n????ho newslettera a u?? v??m ni?? neujde.";
    			t83 = space();
    			form = element("form");
    			input0 = element("input");
    			t84 = space();
    			input1 = element("input");
    			t85 = space();
    			div41 = element("div");
    			div40 = element("div");
    			div38 = element("div");
    			t86 = text("Copyright 2022 ElektroX. Vytvoril ");
    			a28 = element("a");
    			a28.textContent = "Luk???? Fridmansk??";
    			t88 = text(" na z??klade dizajnu z ");
    			a29 = element("a");
    			a29.textContent = "Envytheme";
    			t90 = space();
    			div39 = element("div");
    			t91 = text("Akceptujeme platbu cez: \r\n\t\t\t\t");
    			a30 = element("a");
    			i15 = element("i");
    			t92 = space();
    			a31 = element("a");
    			i16 = element("i");
    			t93 = space();
    			a32 = element("a");
    			i17 = element("i");
    			t94 = space();
    			a33 = element("a");
    			i18 = element("i");
    			t95 = space();
    			a34 = element("a");
    			i19 = element("i");
    			t96 = space();
    			div43 = element("div");
    			t97 = text("Produkt bol ??spe??ne pridan?? do ko????ka\r\n\t\t");
    			div42 = element("div");
    			t98 = space();
    			div45 = element("div");
    			t99 = text("Produkt sa u?? nach??dza v ko????ku\r\n\t\t");
    			div44 = element("div");
    			t100 = space();
    			div47 = element("div");
    			t101 = text("Produkt bol ??spe??ne odstranen?? z ko????ka\r\n\t\t");
    			div46 = element("div");
    			t102 = space();
    			div49 = element("div");
    			t103 = text("Produkt bol ??spe??ne pridan?? do wishlistu\r\n\t\t");
    			div48 = element("div");
    			t104 = space();
    			div51 = element("div");
    			t105 = text("Produkt sa u?? nach??dza vo wishliste\r\n\t\t");
    			div50 = element("div");
    			t106 = space();
    			div53 = element("div");
    			t107 = text("Produkt bol ??spe??ne odstranen?? z wishlistu\r\n\t\t");
    			div52 = element("div");
    			t108 = space();
    			create_component(backtotop.$$.fragment);
    			attr_dev(i0, "class", "fa fa-phone");
    			add_location(i0, file, 81, 6, 2392);
    			attr_dev(a0, "href", "tel:+421234567890");
    			add_location(a0, file, 80, 5, 2356);
    			attr_dev(div0, "class", "mobile_number");
    			add_location(div0, file, 79, 4, 2322);
    			attr_dev(i1, "class", "fas fa-map-marker-alt");
    			add_location(i1, file, 85, 88, 2575);
    			attr_dev(a1, "href", "https://maps.google.com/?q=1910 Blvd, The Bronx, NY, USA");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file, 85, 5, 2492);
    			attr_dev(div1, "class", "address");
    			add_location(div1, file, 84, 4, 2464);
    			attr_dev(div2, "class", "basic-info");
    			add_location(div2, file, 78, 3, 2292);
    			attr_dev(i2, "class", "fas fa-sun");
    			add_location(i2, file, 91, 6, 2773);
    			attr_dev(div3, "class", "sun sun-logo");
    			add_location(div3, file, 90, 5, 2739);
    			attr_dev(i3, "class", "fas fa-moon");
    			add_location(i3, file, 94, 6, 2855);
    			attr_dev(div4, "class", "moon moon-logo");
    			add_location(div4, file, 93, 5, 2819);
    			attr_dev(i4, "class", "indicator");
    			add_location(i4, file, 89, 4, 2711);
    			attr_dev(div5, "class", "toggle");
    			attr_dev(div5, "id", "toggle");
    			add_location(div5, file, 88, 3, 2673);
    			attr_dev(div6, "class", "container header");
    			add_location(div6, file, 77, 2, 2256);
    			add_location(header, file, 76, 1, 2244);
    			attr_dev(i5, "class", "fas fa-bolt");
    			add_location(i5, file, 104, 5, 3083);
    			attr_dev(span0, "class", "x-blue");
    			add_location(span0, file, 105, 12, 3124);
    			attr_dev(a2, "href", "./#");
    			add_location(a2, file, 103, 4, 3062);
    			attr_dev(div7, "class", "logo");
    			add_location(div7, file, 102, 3, 3038);
    			attr_dev(a3, "href", "./#");
    			add_location(a3, file, 111, 6, 3246);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 110, 5, 3217);
    			attr_dev(a4, "href", "#/obchod");
    			add_location(a4, file, 114, 6, 3369);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 113, 5, 3340);
    			attr_dev(a5, "href", "#/kontakt");
    			add_location(a5, file, 117, 6, 3498);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 116, 5, 3469);
    			add_location(ul0, file, 109, 4, 3206);
    			attr_dev(div8, "class", "nav-bar");
    			add_location(div8, file, 108, 3, 3179);
    			attr_dev(i6, "class", "fas fa-heart");
    			add_location(i6, file, 124, 6, 3768);
    			attr_dev(a6, "href", "#/wishlist");
    			add_location(a6, file, 123, 5, 3687);
    			attr_dev(div9, "class", "wishlist nav-icon");
    			add_location(div9, file, 122, 4, 3649);
    			attr_dev(i7, "class", "fas fa-shopping-bag");
    			add_location(i7, file, 128, 5, 3933);
    			attr_dev(div10, "class", "num-of-items");
    			add_location(div10, file, 129, 5, 3975);
    			attr_dev(div11, "class", "basket nav-icon");
    			add_location(div11, file, 127, 4, 3825);
    			attr_dev(i8, "class", "fas fa-search");
    			add_location(i8, file, 132, 5, 4141);
    			attr_dev(div12, "class", "search nav-icon");
    			add_location(div12, file, 131, 4, 4038);
    			attr_dev(div13, "class", "nav-icons");
    			add_location(div13, file, 121, 3, 3620);
    			attr_dev(span1, "class", "h-line");
    			add_location(span1, file, 136, 20, 4295);
    			attr_dev(span2, "class", "h-line");
    			add_location(span2, file, 137, 20, 4345);
    			attr_dev(span3, "class", "h-line");
    			add_location(span3, file, 138, 20, 4395);
    			attr_dev(div14, "class", "hamburger");
    			add_location(div14, file, 135, 3, 4198);
    			attr_dev(div15, "class", "container navigation");
    			add_location(div15, file, 101, 2, 2999);
    			attr_dev(nav, "class", nav_class_value = /*scroll_position*/ ctx[0] > 50 ? 'scrolled' : '');
    			add_location(nav, file, 100, 1, 2941);
    			attr_dev(div16, "class", "container services");
    			add_location(div16, file, 144, 2, 4515);
    			attr_dev(div17, "class", "pre-footer");
    			add_location(div17, file, 143, 1, 4487);
    			attr_dev(i9, "class", "fas fa-bolt");
    			add_location(i9, file, 163, 6, 5000);
    			attr_dev(span4, "class", "x-blue");
    			add_location(span4, file, 164, 13, 5042);
    			attr_dev(a7, "href", "./#");
    			add_location(a7, file, 162, 5, 4978);
    			attr_dev(div18, "class", "logo");
    			add_location(div18, file, 161, 4, 4953);
    			add_location(b0, file, 169, 6, 5175);
    			attr_dev(a8, "href", "tel:+421234567890");
    			add_location(a8, file, 169, 22, 5191);
    			attr_dev(div19, "class", "tel-number menu-item");
    			add_location(div19, file, 168, 5, 5133);
    			add_location(b1, file, 172, 6, 5295);
    			attr_dev(a9, "href", "mailto:info@elektrox.sk");
    			add_location(a9, file, 172, 20, 5309);
    			attr_dev(div20, "class", "mail menu-item");
    			add_location(div20, file, 171, 5, 5259);
    			add_location(b2, file, 175, 6, 5422);
    			attr_dev(a10, "href", "https://maps.google.com/?q=1910 Blvd, The Bronx, NY, USA");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file, 175, 21, 5437);
    			attr_dev(div21, "class", "address menu-item");
    			add_location(div21, file, 174, 5, 5383);
    			attr_dev(i10, "class", "fab fa-facebook");
    			add_location(i10, file, 179, 7, 5647);
    			attr_dev(a11, "href", "https://facebook.com");
    			add_location(a11, file, 178, 6, 5607);
    			attr_dev(i11, "class", "fab fa-twitter");
    			add_location(i11, file, 182, 7, 5737);
    			attr_dev(a12, "href", "https://twitter.com");
    			add_location(a12, file, 181, 6, 5698);
    			attr_dev(i12, "class", "fab fa-instagram");
    			add_location(i12, file, 185, 7, 5828);
    			attr_dev(a13, "href", "https://instagram.com");
    			add_location(a13, file, 184, 6, 5787);
    			attr_dev(i13, "class", "fab fa-linkedin");
    			add_location(i13, file, 188, 7, 5920);
    			attr_dev(a14, "href", "https://linkedin.com");
    			add_location(a14, file, 187, 6, 5880);
    			attr_dev(i14, "class", "fab fa-pinterest");
    			add_location(i14, file, 191, 7, 6012);
    			attr_dev(a15, "href", "https://pinterest.com");
    			add_location(a15, file, 190, 6, 5971);
    			attr_dev(div22, "class", "social-icons");
    			add_location(div22, file, 177, 5, 5573);
    			attr_dev(div23, "class", "contact-menu");
    			add_location(div23, file, 167, 4, 5100);
    			attr_dev(div24, "class", "column");
    			add_location(div24, file, 160, 3, 4927);
    			attr_dev(div25, "class", "column-title");
    			add_location(div25, file, 197, 4, 6123);
    			attr_dev(div26, "class", "blue-line");
    			add_location(div26, file, 198, 4, 6171);
    			attr_dev(a16, "href", "#/");
    			add_location(a16, file, 201, 10, 6260);
    			add_location(li3, file, 201, 6, 6256);
    			attr_dev(a17, "href", "#/kontakt");
    			add_location(a17, file, 202, 10, 6299);
    			add_location(li4, file, 202, 6, 6295);
    			attr_dev(a18, "href", "#/zasady_ochrany_osobnych_udajov");
    			add_location(a18, file, 203, 10, 6347);
    			add_location(li5, file, 203, 6, 6343);
    			attr_dev(a19, "href", "#/podmienky");
    			add_location(a19, file, 204, 10, 6441);
    			add_location(li6, file, 204, 6, 6437);
    			attr_dev(a20, "href", "#/doprava");
    			add_location(a20, file, 205, 10, 6493);
    			add_location(li7, file, 205, 6, 6489);
    			attr_dev(a21, "href", "#/reklamacie");
    			add_location(a21, file, 206, 10, 6553);
    			add_location(li8, file, 206, 6, 6549);
    			add_location(ul1, file, 200, 5, 6244);
    			attr_dev(div27, "class", "informations-menu");
    			add_location(div27, file, 199, 4, 6206);
    			attr_dev(div28, "class", "column");
    			add_location(div28, file, 196, 3, 6097);
    			attr_dev(div29, "class", "column-title");
    			add_location(div29, file, 211, 4, 6679);
    			attr_dev(div30, "class", "blue-line");
    			add_location(div30, file, 212, 4, 6725);
    			attr_dev(a22, "href", "#/faqs");
    			add_location(a22, file, 215, 10, 6814);
    			add_location(li9, file, 215, 6, 6810);
    			attr_dev(a23, "href", "#/login");
    			add_location(a23, file, 216, 10, 6864);
    			add_location(li10, file, 216, 6, 6860);
    			attr_dev(a24, "href", "#/login");
    			add_location(a24, file, 217, 10, 6911);
    			add_location(li11, file, 217, 6, 6907);
    			attr_dev(a25, "href", "#/wishlist");
    			add_location(a25, file, 218, 10, 6969);
    			add_location(li12, file, 218, 6, 6965);
    			attr_dev(a26, "href", "#/newsletter");
    			add_location(a26, file, 219, 10, 7019);
    			add_location(li13, file, 219, 6, 7015);
    			attr_dev(a27, "href", "#/zasady_nakupu");
    			add_location(a27, file, 220, 10, 7073);
    			add_location(li14, file, 220, 6, 7069);
    			add_location(ul2, file, 214, 5, 6798);
    			attr_dev(div31, "class", "informations-menu");
    			add_location(div31, file, 213, 4, 6760);
    			attr_dev(div32, "class", "column");
    			add_location(div32, file, 210, 3, 6653);
    			attr_dev(div33, "class", "column-title");
    			add_location(div33, file, 225, 4, 7187);
    			attr_dev(div34, "class", "blue-line");
    			add_location(div34, file, 226, 4, 7235);
    			attr_dev(div35, "class", "column-subtitle");
    			add_location(div35, file, 227, 4, 7270);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "placeholder", "Zadaj svoju emailov?? adresu");
    			add_location(input0, file, 229, 5, 7413);
    			attr_dev(input1, "type", "submit");
    			input1.value = "Odobera?? newsletter";
    			add_location(input1, file, 230, 5, 7482);
    			attr_dev(form, "action", "javascript:void(0);");
    			add_location(form, file, 228, 4, 7371);
    			attr_dev(div36, "class", "column");
    			add_location(div36, file, 224, 3, 7161);
    			attr_dev(div37, "class", "container footer");
    			add_location(div37, file, 159, 2, 4892);
    			add_location(footer, file, 158, 1, 4880);
    			attr_dev(a28, "href", "../../");
    			attr_dev(a28, "class", "name");
    			add_location(a28, file, 237, 60, 7709);
    			attr_dev(a29, "href", "https://medq-react.envytheme.com/");
    			attr_dev(a29, "target", "_blank");
    			attr_dev(a29, "class", "name");
    			add_location(a29, file, 237, 132, 7781);
    			attr_dev(div38, "class", "copy-left");
    			add_location(div38, file, 237, 3, 7652);
    			attr_dev(i15, "class", "fab fa-cc-visa");
    			add_location(i15, file, 240, 30, 7964);
    			attr_dev(a30, "href", "https://visa.sk");
    			add_location(a30, file, 240, 4, 7938);
    			attr_dev(i16, "class", "fab fa-cc-mastercard");
    			add_location(i16, file, 241, 36, 8036);
    			attr_dev(a31, "href", "https://mastercard.sk");
    			add_location(a31, file, 241, 4, 8004);
    			attr_dev(i17, "class", "fab fa-google-pay");
    			add_location(i17, file, 242, 37, 8115);
    			attr_dev(a32, "href", "https://pay.google.com");
    			add_location(a32, file, 242, 4, 8082);
    			attr_dev(i18, "class", "fab fa-apple-pay");
    			add_location(i18, file, 243, 46, 8200);
    			attr_dev(a33, "href", "https://apple.com/sk/apple-pay/");
    			add_location(a33, file, 243, 4, 8158);
    			attr_dev(i19, "class", "fab fa-cc-paypal");
    			add_location(i19, file, 244, 33, 8271);
    			attr_dev(a34, "href", "https://paypal.com");
    			add_location(a34, file, 244, 4, 8242);
    			attr_dev(div39, "class", "copy-right");
    			add_location(div39, file, 238, 3, 7878);
    			attr_dev(div40, "class", "container copyright");
    			add_location(div40, file, 236, 2, 7614);
    			attr_dev(div41, "class", "copyright-footer");
    			add_location(div41, file, 235, 1, 7580);
    			attr_dev(div42, "class", "card-line");
    			add_location(div42, file, 250, 2, 8422);
    			attr_dev(div43, "class", "added-to-cart info-card");
    			add_location(div43, file, 248, 1, 8340);
    			attr_dev(div44, "class", "card-line");
    			add_location(div44, file, 254, 2, 8544);
    			attr_dev(div45, "class", "cart-includes-item info-card");
    			add_location(div45, file, 252, 1, 8463);
    			attr_dev(div46, "class", "card-line");
    			add_location(div46, file, 258, 2, 8668);
    			attr_dev(div47, "class", "item-deleted info-card");
    			add_location(div47, file, 256, 1, 8585);
    			attr_dev(div48, "class", "card-line");
    			add_location(div48, file, 262, 2, 8794);
    			attr_dev(div49, "class", "added-to-wish info-card");
    			add_location(div49, file, 260, 1, 8709);
    			attr_dev(div50, "class", "card-line");
    			add_location(div50, file, 266, 2, 8920);
    			attr_dev(div51, "class", "wish-includes-item info-card");
    			add_location(div51, file, 264, 1, 8835);
    			attr_dev(div52, "class", "card-line");
    			add_location(div52, file, 270, 2, 9057);
    			attr_dev(div53, "class", "item-deleted-from-wish info-card");
    			add_location(div53, file, 268, 1, 8961);
    			add_location(main, file, 69, 0, 2070);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(loader, main, null);
    			append_dev(main, t0);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t1);
    			mount_component(search, main, null);
    			append_dev(main, t2);
    			mount_component(cart_1, main, null);
    			append_dev(main, t3);
    			append_dev(main, header);
    			append_dev(header, div6);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, i0);
    			append_dev(a0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t6);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, i4);
    			append_dev(i4, div3);
    			append_dev(div3, i2);
    			append_dev(i4, t8);
    			append_dev(i4, div4);
    			append_dev(div4, i3);
    			append_dev(main, t9);
    			append_dev(main, nav);
    			append_dev(nav, div15);
    			append_dev(div15, div7);
    			append_dev(div7, a2);
    			append_dev(a2, i5);
    			append_dev(a2, t10);
    			append_dev(a2, span0);
    			append_dev(div15, t12);
    			append_dev(div15, div8);
    			append_dev(div8, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a3);
    			append_dev(ul0, t14);
    			append_dev(ul0, li1);
    			append_dev(li1, a4);
    			append_dev(ul0, t16);
    			append_dev(ul0, li2);
    			append_dev(li2, a5);
    			append_dev(div15, t18);
    			append_dev(div15, div13);
    			append_dev(div13, div9);
    			append_dev(div9, a6);
    			append_dev(a6, i6);
    			append_dev(div13, t19);
    			append_dev(div13, div11);
    			append_dev(div11, i7);
    			append_dev(div11, t20);
    			append_dev(div11, div10);
    			append_dev(div10, t21);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div12, i8);
    			append_dev(div15, t23);
    			append_dev(div15, div14);
    			append_dev(div14, span1);
    			append_dev(div14, t24);
    			append_dev(div14, span2);
    			append_dev(div14, t25);
    			append_dev(div14, span3);
    			append_dev(main, t26);
    			mount_component(router, main, null);
    			append_dev(main, t27);
    			append_dev(main, div17);
    			append_dev(div17, div16);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div16, null);
    			}

    			append_dev(main, t28);
    			append_dev(main, footer);
    			append_dev(footer, div37);
    			append_dev(div37, div24);
    			append_dev(div24, div18);
    			append_dev(div18, a7);
    			append_dev(a7, i9);
    			append_dev(a7, t29);
    			append_dev(a7, span4);
    			append_dev(div24, t31);
    			append_dev(div24, div23);
    			append_dev(div23, div19);
    			append_dev(div19, b0);
    			append_dev(div19, t33);
    			append_dev(div19, a8);
    			append_dev(div23, t35);
    			append_dev(div23, div20);
    			append_dev(div20, b1);
    			append_dev(div20, t37);
    			append_dev(div20, a9);
    			append_dev(div23, t39);
    			append_dev(div23, div21);
    			append_dev(div21, b2);
    			append_dev(div21, t41);
    			append_dev(div21, a10);
    			append_dev(div23, t43);
    			append_dev(div23, div22);
    			append_dev(div22, a11);
    			append_dev(a11, i10);
    			append_dev(div22, t44);
    			append_dev(div22, a12);
    			append_dev(a12, i11);
    			append_dev(div22, t45);
    			append_dev(div22, a13);
    			append_dev(a13, i12);
    			append_dev(div22, t46);
    			append_dev(div22, a14);
    			append_dev(a14, i13);
    			append_dev(div22, t47);
    			append_dev(div22, a15);
    			append_dev(a15, i14);
    			append_dev(div37, t48);
    			append_dev(div37, div28);
    			append_dev(div28, div25);
    			append_dev(div28, t50);
    			append_dev(div28, div26);
    			append_dev(div28, t51);
    			append_dev(div28, div27);
    			append_dev(div27, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, a16);
    			append_dev(ul1, t53);
    			append_dev(ul1, li4);
    			append_dev(li4, a17);
    			append_dev(ul1, t55);
    			append_dev(ul1, li5);
    			append_dev(li5, a18);
    			append_dev(ul1, t57);
    			append_dev(ul1, li6);
    			append_dev(li6, a19);
    			append_dev(ul1, t59);
    			append_dev(ul1, li7);
    			append_dev(li7, a20);
    			append_dev(ul1, t61);
    			append_dev(ul1, li8);
    			append_dev(li8, a21);
    			append_dev(div37, t63);
    			append_dev(div37, div32);
    			append_dev(div32, div29);
    			append_dev(div32, t65);
    			append_dev(div32, div30);
    			append_dev(div32, t66);
    			append_dev(div32, div31);
    			append_dev(div31, ul2);
    			append_dev(ul2, li9);
    			append_dev(li9, a22);
    			append_dev(ul2, t68);
    			append_dev(ul2, li10);
    			append_dev(li10, a23);
    			append_dev(ul2, t70);
    			append_dev(ul2, li11);
    			append_dev(li11, a24);
    			append_dev(ul2, t72);
    			append_dev(ul2, li12);
    			append_dev(li12, a25);
    			append_dev(ul2, t74);
    			append_dev(ul2, li13);
    			append_dev(li13, a26);
    			append_dev(ul2, t76);
    			append_dev(ul2, li14);
    			append_dev(li14, a27);
    			append_dev(div37, t78);
    			append_dev(div37, div36);
    			append_dev(div36, div33);
    			append_dev(div36, t80);
    			append_dev(div36, div34);
    			append_dev(div36, t81);
    			append_dev(div36, div35);
    			append_dev(div36, t83);
    			append_dev(div36, form);
    			append_dev(form, input0);
    			append_dev(form, t84);
    			append_dev(form, input1);
    			append_dev(main, t85);
    			append_dev(main, div41);
    			append_dev(div41, div40);
    			append_dev(div40, div38);
    			append_dev(div38, t86);
    			append_dev(div38, a28);
    			append_dev(div38, t88);
    			append_dev(div38, a29);
    			append_dev(div40, t90);
    			append_dev(div40, div39);
    			append_dev(div39, t91);
    			append_dev(div39, a30);
    			append_dev(a30, i15);
    			append_dev(div39, t92);
    			append_dev(div39, a31);
    			append_dev(a31, i16);
    			append_dev(div39, t93);
    			append_dev(div39, a32);
    			append_dev(a32, i17);
    			append_dev(div39, t94);
    			append_dev(div39, a33);
    			append_dev(a33, i18);
    			append_dev(div39, t95);
    			append_dev(div39, a34);
    			append_dev(a34, i19);
    			append_dev(main, t96);
    			append_dev(main, div43);
    			append_dev(div43, t97);
    			append_dev(div43, div42);
    			append_dev(main, t98);
    			append_dev(main, div45);
    			append_dev(div45, t99);
    			append_dev(div45, div44);
    			append_dev(main, t100);
    			append_dev(main, div47);
    			append_dev(div47, t101);
    			append_dev(div47, div46);
    			append_dev(main, t102);
    			append_dev(main, div49);
    			append_dev(div49, t103);
    			append_dev(div49, div48);
    			append_dev(main, t104);
    			append_dev(main, div51);
    			append_dev(div51, t105);
    			append_dev(div51, div50);
    			append_dev(main, t106);
    			append_dev(main, div53);
    			append_dev(div53, t107);
    			append_dev(div53, div52);
    			append_dev(main, t108);
    			mount_component(backtotop, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "scroll", () => {
    						scrolling = true;
    						clearTimeout(scrolling_timeout);
    						scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    						/*onwindowscroll*/ ctx[10]();
    					}),
    					listen_dev(a3, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(a4, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(a5, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev(a6, "click", /*click_handler_3*/ ctx[14], false, false, false),
    					listen_dev(div11, "click", /*click_handler_4*/ ctx[15], false, false, false),
    					listen_dev(div12, "click", /*click_handler_5*/ ctx[16], false, false, false),
    					listen_dev(div14, "click", /*click_handler_6*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*scroll_position*/ 1 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1.pageXOffset, /*scroll_position*/ ctx[0]);
    				scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    			}

    			const search_changes = {};
    			if (dirty & /*random_num_search*/ 8) search_changes.random_num_search = /*random_num_search*/ ctx[3];
    			search.$set(search_changes);
    			const cart_1_changes = {};
    			if (dirty & /*show*/ 2) cart_1_changes.show = /*show*/ ctx[1];
    			if (dirty & /*random_num*/ 4) cart_1_changes.random_num = /*random_num*/ ctx[2];
    			if (dirty & /*cart*/ 32) cart_1_changes.cart = /*cart*/ ctx[5];
    			if (dirty & /*totalSum*/ 16) cart_1_changes.totalSum = /*totalSum*/ ctx[4];
    			cart_1.$set(cart_1_changes);
    			if ((!current || dirty & /*cart*/ 32) && t21_value !== (t21_value = /*cart*/ ctx[5].length + "")) set_data_dev(t21, t21_value);

    			if (!current || dirty & /*scroll_position*/ 1 && nav_class_value !== (nav_class_value = /*scroll_position*/ ctx[0] > 50 ? 'scrolled' : '')) {
    				attr_dev(nav, "class", nav_class_value);
    			}

    			if (dirty & /*services*/ 0) {
    				each_value = services;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div16, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(search.$$.fragment, local);
    			transition_in(cart_1.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(backtotop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(search.$$.fragment, local);
    			transition_out(cart_1.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(backtotop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(loader);
    			if (if_block) if_block.d();
    			destroy_component(search);
    			destroy_component(cart_1);
    			destroy_component(router);
    			destroy_each(each_blocks, detaching);
    			destroy_component(backtotop);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let cart;
    	let totalSum;
    	let $location;
    	validate_store(location$1, 'location');
    	component_subscribe($$self, location$1, $$value => $$invalidate(9, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let routes = {
    		"/": Home,
    		"/obchod": Shop,
    		"/obchod/:category": Products,
    		"/obchod/:category/:product": Product,
    		"/kontakt": Contact,
    		"/kosik": Cart$1,
    		"/wishlist": Wishlist,
    		"/vyhladavanie=/:search_value": Search$1,
    		"*": NotFound
    	};

    	let scroll_position;

    	function IsCartChanged() {
    		$$invalidate(5, cart = JSON.parse(localStorage.getItem("cart"))
    		? JSON.parse(localStorage.getItem("cart"))
    		: []);

    		$$invalidate(4, totalSum = JSON.parse(localStorage.getItem("totalSum"))
    		? JSON.parse(localStorage.getItem("totalSum"))
    		: 0);

    		setTimeout(
    			() => {
    				IsCartChanged();
    			},
    			100
    		);
    	}

    	IsCartChanged();
    	let show = false;
    	let random_num = Math.random();

    	function showCartPreview() {
    		$$invalidate(1, show = true);
    		$$invalidate(2, random_num = Math.random());
    	}

    	let random_num_search = Math.random();

    	function showSearch() {
    		$$invalidate(3, random_num_search = Math.random());
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(0, scroll_position = window_1.pageYOffset);
    	}

    	const click_handler = () => hamburgerMenu(window.innerWidth);
    	const click_handler_1 = () => hamburgerMenu(window.innerWidth);
    	const click_handler_2 = () => hamburgerMenu(window.innerWidth);
    	const click_handler_3 = () => hamburgerMenu(window.innerWidth);

    	const click_handler_4 = () => {
    		showCartPreview();
    		hamburgerMenu(window.innerWidth);
    	};

    	const click_handler_5 = () => {
    		showSearch();
    		hamburgerMenu(window.innerWidth);
    	};

    	const click_handler_6 = () => hamburgerMenu(window.innerWidth);

    	$$self.$capture_state = () => ({
    		Router,
    		services,
    		Home,
    		Shop,
    		Products,
    		Product,
    		Contact,
    		NotFound,
    		CartRoute: Cart$1,
    		Wishlist,
    		SearchRoute: Search$1,
    		BackToTop,
    		Cart,
    		Search,
    		Loader,
    		Newsletter,
    		hamburgerMenu,
    		location: location$1,
    		routes,
    		scroll_position,
    		IsCartChanged,
    		show,
    		random_num,
    		showCartPreview,
    		random_num_search,
    		showSearch,
    		totalSum,
    		cart,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(6, routes = $$props.routes);
    		if ('scroll_position' in $$props) $$invalidate(0, scroll_position = $$props.scroll_position);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('random_num' in $$props) $$invalidate(2, random_num = $$props.random_num);
    		if ('random_num_search' in $$props) $$invalidate(3, random_num_search = $$props.random_num_search);
    		if ('totalSum' in $$props) $$invalidate(4, totalSum = $$props.totalSum);
    		if ('cart' in $$props) $$invalidate(5, cart = $$props.cart);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 512) {
    			{
    				window.scrollTo(0, 0);
    			}
    		}
    	};

    	$$invalidate(5, cart = JSON.parse(localStorage.getItem("cart"))
    	? JSON.parse(localStorage.getItem("cart"))
    	: []);

    	$$invalidate(4, totalSum = JSON.parse(localStorage.getItem("totalSum"))
    	? JSON.parse(localStorage.getItem("totalSum"))
    	: 0);

    	return [
    		scroll_position,
    		show,
    		random_num,
    		random_num_search,
    		totalSum,
    		cart,
    		routes,
    		showCartPreview,
    		showSearch,
    		$location,
    		onwindowscroll,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    // hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const header = document.querySelector("header");
    const nav = document.querySelector(".navigation");

    function hamburgerMenu(width) {
        if (width <= 750 || nav.classList.contains('active')) {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            header.classList.toggle('active');
        }
    }

    // dark-mode toggle
    const body = document.querySelector('main');
    const toggle = document.querySelector('#toggle');

    let theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light';

    if (theme == 'dark') {
        body.classList.toggle('dark');
        document.querySelector(".sun-logo").classList.toggle("animate-sun");
        document.querySelector(".moon-logo").classList.toggle("animate-moon");
    }

    toggle.onclick = function() {
        body.classList.toggle('dark');
        document.querySelector(".sun-logo").classList.toggle("animate-sun");
        document.querySelector(".moon-logo").classList.toggle("animate-moon");

        if (theme == 'light') {
            theme = 'dark';
        } else if (theme == 'dark') {
            theme = 'light';
        }

        localStorage.setItem('theme', theme);
    };

    // cart
    let cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];

    let added_to_cart = document.querySelector('.added-to-cart');
    let cart_includes = document.querySelector('.cart-includes-item');
    let deleted_item = document.querySelector('.item-deleted');
    let added_to_wish = document.querySelector('.added-to-wish');
    let wish_includes = document.querySelector('.wish-includes-item');
    let deleted_item_from_wish = document.querySelector('.item-deleted-from-wish');

    function addToCart(product, color, quantity) {
        cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
        let card_includes_item = true;
        let cart_item = [product, color, quantity];
        for (let i = 0; i < cart.length; i++) {
            if (cart[i][0].id == cart_item[0].id && cart[i][1].title == cart_item[1].title) {
                card_includes_item = false;
            }
        }
        if (card_includes_item) {
            cart_includes.classList.remove('active');
            deleted_item.classList.remove('active');
            wish_includes.classList.remove('active');
            deleted_item_from_wish.classList.remove('active');
            added_to_wish.classList.remove('active');
            cart.push(cart_item);
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("totalSum", calculateTotalSum(cart));

            if (!added_to_cart.classList.contains('active')) {
                added_to_cart.classList.add('active');
                setTimeout(() => {
                    added_to_cart.classList.remove('active');
                }, 5000);
            }
        } else {
            added_to_cart.classList.remove('active');
            deleted_item.classList.remove('active');
            wish_includes.classList.remove('active');
            deleted_item_from_wish.classList.remove('active');
            added_to_wish.classList.remove('active');

            if (!cart_includes.classList.contains('active')) {
                cart_includes.classList.add('active');
                setTimeout(() => {
                    cart_includes.classList.remove('active');
                }, 5000);
            }
        }
    }

    function removeItemFromCart(item_index) {
        cart_includes.classList.remove('active');
        added_to_cart.classList.remove('active');
        wish_includes.classList.remove('active');
        deleted_item_from_wish.classList.remove('active');
        added_to_wish.classList.remove('active');
        cart.splice(item_index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("totalSum", calculateTotalSum(cart));


        if (!deleted_item.classList.contains('active')) {
            deleted_item.classList.add('active');
            setTimeout(() => {
                deleted_item.classList.remove('active');
            }, 5000);
        }
    }

    function calculateTotalSum(cart) {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i][0].discount_bollean) {
                total += cart[i][0].discount_price * cart[i][2];
            } else {
                total += cart[i][0].price * cart[i][2];
            }
        }
        return total.toFixed(2);
    }

    // wishlist
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];


    function addToWishlist(product) {
        wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];
        let wish_includes_item = true;
        for (let i = 0; i < wishlist.length; i++) {
            if (wishlist[i].id == product.id) {
                wish_includes_item = false;
            }
        }
        if (wish_includes_item) {
            cart_includes.classList.remove('active');
            deleted_item.classList.remove('active');
            added_to_cart.classList.remove('active');
            wishlist.push(product);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            wish_includes.classList.remove('active');
            deleted_item_from_wish.classList.remove('active');
            if (!added_to_wish.classList.contains('active')) {
                added_to_wish.classList.add('active');
                setTimeout(() => {
                    added_to_wish.classList.remove('active');
                }, 5000);
            }
        } else {
            added_to_wish.classList.remove('active');
            cart_includes.classList.remove('active');
            deleted_item.classList.remove('active');
            added_to_cart.classList.remove('active');
            deleted_item_from_wish.classList.remove('active');
            if (!wish_includes.classList.contains('active')) {
                wish_includes.classList.add('active');
                setTimeout(() => {
                    wish_includes.classList.remove('active');
                }, 5000);
            }
        }
    }
    function removeItemFromWish(item_index) {
        added_to_wish.classList.remove('active');
        wish_includes.classList.remove('active');
        cart_includes.classList.remove('active');
        deleted_item.classList.remove('active');
        added_to_cart.classList.remove('active');
        wishlist.splice(item_index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        if (!deleted_item_from_wish.classList.contains('active')) {
            deleted_item_from_wish.classList.add('active');
            setTimeout(() => {
                deleted_item_from_wish.classList.remove('active');
            }, 5000);
        }
    }

    exports.addToCart = addToCart;
    exports.addToWishlist = addToWishlist;
    exports.calculateTotalSum = calculateTotalSum;
    exports["default"] = app;
    exports.hamburgerMenu = hamburgerMenu;
    exports.removeItemFromCart = removeItemFromCart;
    exports.removeItemFromWish = removeItemFromWish;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
