import { Text } from "preact-i18n";

import { ModalForm } from "@revoltchat/ui";

import { noop } from "../../../lib/js";

import { useClient } from "../../client/ClientController";
import { ModalProps } from "../types";
import { modalController } from "../ModalController";

/**
 * Add friend modal
 */
export default function AddFriend({ ...props }: ModalProps<"add_friend">) {
    const client = useClient();
    const SYSTEM_ID = "01JZZFV835K5RH8KFZCQ6Z780Q";
    const SYSTEM_USERNAME = "System";
    const SYSTEM_TAG = "0000";

    return (
        <ModalForm
            {...props}
            title="Add Friend"
            schema={{
                username: "text",
            }}
            data={{
                username: {
                    field: "Username",
                    placeholder: "username#1234",
                },
            }}
            callback={async ({ username }) => {
                // Block adding System#0000 by username or by ID
                const [name, tag] = username.split("#");
                if (
                    (name && tag && name.trim().toLowerCase() === SYSTEM_USERNAME.toLowerCase() && tag === SYSTEM_TAG) ||
                    username === SYSTEM_ID
                ) {
                    // Show error modal
                    props.onClose?.();
                    modalController.push({
                        type: "error",
                        error: "You cannot add this account as a friend.",
                    });
                    return;
                }
                return client.api.post(`/users/friend`, { username }).then(noop);
            }}
            submit={{
                children: <Text id="app.special.modals.actions.ok" />,
            }}
        />
    );
}
