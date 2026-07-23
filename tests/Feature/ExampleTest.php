<?php

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect('/rpg');
});

test('rpg page is available', function () {
    $response = $this->get(route('rpg'));

    $response->assertOk();
});