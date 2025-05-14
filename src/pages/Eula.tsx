import { Stack, Title, Text, Button, Image,} from "@mantine/core"
import {notifications } from "@mantine/notifications"

export const Eula = () => {
    return(
        <Stack p="lg">
            <Button
                onClick={() =>
                    notifications.show({
                    title: 'You are currently offline.',
                    message: <><Image/><Text size="xs">You can still use certain features of the app, and we'll sync up your changes when you reconnect!</Text></>,
                    autoClose: false,
                    })
                }
                >
                Show Notification
            </Button>
            <Title>End User License Agreement (EULA)</Title>
            <Text>
            Effective Date: [Insert Date]
            Software: Simulacrum
            Licensor: RichMUN

            This End User License Agreement (“Agreement”) is a legal agreement between you (either an individual or a legal entity) and RichMUN (“Licensor”) governing your use of the web-based software application known as Simulacrum (“Software”).

            By accessing or using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to the terms of this Agreement, you may not use the Software.

            1. Grant of License
            Subject to your compliance with the terms of this Agreement, Licensor hereby grants you a limited, non-exclusive, non-transferable, non-sublicensable, and revocable license to access and use the Software via the web solely for lawful purposes.

            This license permits multi-user access and is provided under a freemium model, whereby:

            The free version includes access to basic features.

            Premium features are accessible upon payment of applicable fees and subject to additional terms.

            2. Restrictions
            You shall not:

            Modify, adapt, translate, reverse engineer, decompile, disassemble, or otherwise attempt to derive source code from the Software;

            Reproduce, distribute, publicly display, sell, sublicense, rent, lease, or otherwise exploit the Software for any commercial purpose not expressly authorized by Licensor;

            Use the Software in any manner that violates any applicable law, regulation, or third-party rights;

            Circumvent or attempt to circumvent any restrictions or limitations imposed on user accounts or access levels.

            3. Installation and Access
            You may access the Software from multiple devices, provided such access is solely by you or by authorized users within your organization, as permitted by your subscription plan.

            4. Data Collection and Privacy
            The Software may collect and process the following data:

            Authentication and user account information provided via Gmail sign-in;

            Content or input submitted directly by users during use of the Software.

            Licensor does not share user data with third-party services and does not use external analytics or advertising platforms. By using the Software, you acknowledge and consent to such data collection.

            A separate Privacy Policy may be published and updated by Licensor at its sole discretion.

            5. Termination
            This Agreement shall remain in effect until terminated. Licensor reserves the right to suspend or terminate your access to the Software at any time and for any reason, including but not limited to:

            Breach of any provision of this Agreement;

            Non-payment of fees associated with premium features;

            Attempted or actual unauthorized use, reproduction, or distribution of the Software;

            Use of the Software in any unlawful, abusive, or harmful manner.

            Upon termination, all rights granted under this Agreement shall immediately cease, and you shall discontinue all use of the Software.

            6. Disclaimer of Warranties
            THE SOFTWARE IS PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTY OF ANY KIND. LICENSOR EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

            LICENSOR MAKES NO WARRANTY THAT THE SOFTWARE WILL MEET YOUR REQUIREMENTS, OPERATE UNINTERRUPTED, OR BE ERROR-FREE.

            7. Limitation of Liability
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, BUSINESS INTERRUPTION, OR LOSS OF DATA, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

            IN NO EVENT SHALL LICENSOR’S TOTAL LIABILITY UNDER THIS AGREEMENT EXCEED THE AMOUNT PAID BY YOU (IF ANY) FOR ACCESS TO THE PREMIUM FEATURES OF THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

            8. Governing Law
            This Agreement shall be governed by and construed in accordance with the laws of the Province of British Columbia, Canada, without regard to its conflict of law provisions. You hereby consent to the exclusive jurisdiction and venue of the courts located in British Columbia for the resolution of any disputes arising out of or relating to this Agreement.

            9. Contact Information
            For inquiries regarding this Agreement, please contact:
            [Insert Contact Email or Web Form Link]
            </Text>
        </Stack>
        
    )
    
}